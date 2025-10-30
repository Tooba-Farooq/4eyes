from django.shortcuts import render
from rest_framework.response import Response
from django.db.models import Count
from rest_framework.decorators import api_view

from .models import Product , Category, HeroSlide
from .serializers import FeaturedProductSerializer,CategorySerializer, HeroSlideSerializer, ProductDetailSerializer

# Create your views here.

@api_view(['GET'])
def hero_slides(request):
    slides = HeroSlide.objects.all()
    serializer = HeroSlideSerializer(slides, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def featured_products(request):
    products = Product.objects.filter(is_featured=True)
    serializer = FeaturedProductSerializer(products, many=True, context={'request': request})
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

