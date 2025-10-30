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

class ProductDetailSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    stock_status = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock_status',
            'brand', 'frame_material', 'color', 'gender',
            'image', 'category'
        ]

    def get_stock_status(self, obj):
        if obj.stock <= 0:
            return "Out of stock"
        elif obj.stock <= 5:
            return "Low stock"
        return "In stock"

class CategorySerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(source='product_count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'count']


