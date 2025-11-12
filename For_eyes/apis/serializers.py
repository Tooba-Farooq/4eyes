from rest_framework import serializers
from .models import Product, Category, HeroSlide, Order, OrderItem

class HeroSlideSerializer(serializers.ModelSerializer):

    class Meta:
        model = HeroSlide
        fields = ['id', 'title', 'subtitle', 'cta', 'image']

class ProductCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'tag']

class ProductDetailSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    stock_status = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock_status',
            'brand', 'frame_material', 'color', 'gender',
            'image', 'category', 'tag'
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

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'id', 'name', 'email', 'phone', 'address', 'instructions',
            'discount_code', 'payment_method', 'items', 'total_amount', 'status', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        payment_method = validated_data.get('payment_method', 'cod')

        order = Order.objects.create(**validated_data)

        total = 0
        for item in items_data:
            product = item['product']
            quantity = item['quantity']
            price = item['price']

            OrderItem.objects.create(order=order, product=product, quantity=quantity, price=price)
            total += price * quantity

        order.total_amount = total

        if payment_method == 'card':
            order.status = 'Awaiting Payment'
            order.is_paid = False
        else:
            # for COD, confirm immediately and deduct stock
            order.status = 'Confirmed'
            order.is_paid = False

            for oi in order.items.all():
                product = oi.product
                if product.stock < oi.quantity:
                    raise serializers.ValidationError(f"Not enough stock for {product.name}")
                product.stock -= oi.quantity
                product.save()


        order.save()
        return order


