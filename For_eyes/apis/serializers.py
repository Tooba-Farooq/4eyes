from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, Category, HeroSlide, Order, OrderItem, Coupon, Favourite, Address

class HeroSlideSerializer(serializers.ModelSerializer):

    class Meta:
        model = HeroSlide
        fields = ['id', 'title', 'subtitle', 'cta', 'image']

class ProductCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'tag', 'is_AR']

class ProductDetailSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    stock_status = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock_status',
            'brand', 'frame_material', 'color', 'gender',
            'image', 'category', 'tag', 'model', 'is_AR', 'configurations'
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

        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user

        order = Order.objects.create(**validated_data)

        order.order_number = f"ORD-{order.id:06d}"

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
    

User = get_user_model()  

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'phone']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'type', 'street', 'city', 'zip_code', 'phone', 'is_default', 'created_at']
        read_only_fields = ['created_at']


class FavouriteSerializer(serializers.ModelSerializer):
    product = ProductCardSerializer(read_only=True)

    class Meta:
        model = Favourite
        fields = ['id', 'product', 'created_at']
        read_only_fields = ['created_at']


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount', 'min_order', 'expires_at', 'is_active']


# Update OrderSerializer to include items details
class OrderItemDetailSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price']


class OrderListSerializer(serializers.ModelSerializer):
    items = OrderItemDetailSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'name', 'email', 'phone', 'address',
            'total_amount', 'status', 'payment_method', 'is_paid',
            'created_at', 'items'
        ]
        read_only_fields = ['created_at']