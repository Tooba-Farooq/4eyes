from rest_framework import serializers
from .models import Product, Category, HeroSlide

class HeroSlideSerializer(serializers.ModelSerializer):

    class Meta:
        model = HeroSlide
        fields = ['id', 'title', 'subtitle', 'cta', 'image']

class FeaturedProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image']

class CategorySerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(source='product_count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'count']


