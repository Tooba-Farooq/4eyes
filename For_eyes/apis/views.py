from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Count
from rest_framework.decorators import api_view


from .models import Product , Category, HeroSlide
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
                "total": order.total_amount
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


