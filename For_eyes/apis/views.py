from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Count
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import stripe
from django.db.models import Q
from rest_framework.permissions import AllowAny


from .models import Product , Category, HeroSlide, Order, Address, Favourite, Coupon
from .serializers import ProductCardSerializer,CategorySerializer, HeroSlideSerializer, ProductDetailSerializer, OrderSerializer, AddressSerializer, FavouriteSerializer, CouponSerializer, OrderListSerializer, UserSerializer

# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def hero_slides(request):
    slides = HeroSlide.objects.all()
    serializer = HeroSlideSerializer(slides, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def featured_products(request):
    products = Product.objects.filter(is_featured=True)
    serializer = ProductCardSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    serializer = ProductDetailSerializer(product, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    categories = Category.objects.annotate(product_count=Count('products'))
    serializer = CategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
def place_order(request):
    serializer = OrderSerializer(data=request.data, context={'request': request})

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
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    """Get all orders for the authenticated user"""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderListSerializer(orders, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def my_addresses(request):
    """Get all addresses or create a new one for authenticated user"""
    if request.method == 'GET':
        addresses = Address.objects.filter(user=request.user).order_by('-is_default', '-created_at')
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def address_detail(request, pk):
    """Update or delete a specific address"""
    try:
        address = Address.objects.get(pk=pk, user=request.user)
    except Address.DoesNotExist:
        return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        serializer = AddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        address.delete()
        return Response({'message': 'Address deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_favourites(request):
    """Get all favourites for the authenticated user"""
    favourites = Favourite.objects.filter(user=request.user).select_related('product')
    serializer = FavouriteSerializer(favourites, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favourite_ids(request):
    """Get just the product IDs of user's favourites (lightweight)"""
    favourite_ids = Favourite.objects.filter(user=request.user).values_list('product_id', flat=True)
    return Response({
        'product_ids': list(favourite_ids)
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_favourites(request):
    """Add a product to favourites"""
    product_id = request.data.get('product_id')
    
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    favourite, created = Favourite.objects.get_or_create(user=request.user, product=product)
    
    if created:
        serializer = FavouriteSerializer(favourite, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response({'message': 'Product already in favourites'}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_favourites(request, product_id):
    """Remove a product from favourites"""
    try:
        favourite = Favourite.objects.get(user=request.user, product_id=product_id)
        favourite.delete()
        return Response({'message': 'Removed from favourites'}, status=status.HTTP_204_NO_CONTENT)
    except Favourite.DoesNotExist:
        return Response({'error': 'Favourite not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_coupons(request):
    """Get all active coupons for the user"""
    from django.utils import timezone
    coupons = Coupon.objects.filter(
        is_active=True,
        expires_at__gte=timezone.now()
    ).order_by('-created_at')
    serializer = CouponSerializer(coupons, many=True)
    return Response(serializer.data)


# views.py
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get or update user profile"""
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        user = request.user
        user.name = request.data.get('name', user.name)  # Changed from first_name
        user.email = request.data.get('email', user.email)
        user.phone = request.data.get('phone', user.phone)  # Now phone is directly on User model
        user.save()
        
        serializer = UserSerializer(user)
        return Response(serializer.data)


# views.py
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    from django.contrib.auth import authenticate
    
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    
    # Since you're using email for authentication
    if not authenticate(email=user.email, password=current_password):
        return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    
    return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
