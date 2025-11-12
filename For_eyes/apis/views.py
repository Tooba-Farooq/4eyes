from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Count
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.http import HttpResponse
import stripe
from django.db.models import Q

from .models import Product , Category, HeroSlide, Order
from .serializers import ProductCardSerializer,CategorySerializer, HeroSlideSerializer, ProductDetailSerializer, OrderSerializer

# Create your views here.

@api_view(['GET'])
def hero_slides(request):
    slides = HeroSlide.objects.all()
    serializer = HeroSlideSerializer(slides, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def featured_products(request):
    products = Product.objects.filter(is_featured=True)
    serializer = ProductCardSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    serializer = ProductDetailSerializer(product, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def category_list(request):
    categories = Category.objects.annotate(product_count=Count('products'))
    serializer = CategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def product_list(request):
    """
    Returns products filtered by category name (if given).
    Example: /api/products/?category=Eyeglasses
    """
    category_name = request.GET.get('category', None)
    products = Product.objects.all()

    if category_name:
        products = products.filter(category__name__iexact=category_name)

    serializer = ProductCardSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
def place_order(request):
    serializer = OrderSerializer(data=request.data)

    if serializer.is_valid():
        try:
            with transaction.atomic():
                order = serializer.save()
            return Response({
                "message": "Order placed successfully!",
                "order_id": order.id,
                "payment_method": order.payment_method,
                "total": order.total_amount
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_checkout_session(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    order_id = request.data.get('order_id')
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Invalid order id"}, status=404)

    line_items = []
    for item in order.items.all():
        line_items.append({
            'price_data': {
                'currency': 'usd',  # change as needed
                'product_data': {
                    'name': item.product.name,
                },
                'unit_amount': int(item.price * 100),  # cents
            },
            'quantity': item.quantity,
        })

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=f"http://localhost:5173/payment-success?session_id={{CHECKOUT_SESSION_ID}}&order_id={order.id}",
            cancel_url=f"http://localhost:5173/payment-cancel?order_id={order.id}",
            metadata={'order_id': str(order.id)},
        )
        return Response({'url': checkout_session.url}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    stripe.api_key = settings.STRIPE_SECRET_KEY

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_id = session.get('metadata', {}).get('order_id')
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return HttpResponse(status=404)

        # Idempotency: if already paid, ignore
        if not order.is_paid:
            # Mark paid
            order.is_paid = True
            order.status = 'Confirmed'

            # Deduct stock now (ensure availability)
            with transaction.atomic():
                for oi in order.items.select_for_update():
                    product = oi.product
                    if product.stock < oi.quantity:
                        # If stock insufficient, you must decide policy:
                        # - refund, or
                        # - mark order as 'Failed' and notify admin
                        order.status = 'Failed - Insufficient stock'
                        order.save()
                        # Optionally initiate refund here
                        return HttpResponse(status=200)
                    product.stock -= oi.quantity
                    product.save()
                order.save()

    return HttpResponse(status=200)

@api_view(['GET'])
def search_products(request):
    query = request.GET.get('q', '').strip()
    if not query:
        return Response([])

    products = Product.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query) |
        Q(category__name__icontains=query) |
        Q(brand__icontains=query) |
        Q(tag__icontains=query) |
        Q(frame_material__icontains=query) |
        Q(color__icontains=query)
    ).distinct()[:20]

    serializer = ProductCardSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)
