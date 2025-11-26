from django.db import models
from django.contrib.postgres.fields import ArrayField
from decimal import Decimal
from django.conf import settings

# Create your models here.


class HeroSlide(models.Model):
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=200)
    cta = models.CharField(max_length=50)  
    image = models.ImageField(upload_to='hero_slides/')

    def __str__(self):
        return f"{self.title}"
    

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)  
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    GENDER_CHOICES = [
    ('M', 'Men'),
    ('F', 'Women'),
    ('U', 'Unisex'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    model = models.FileField(upload_to='products/', blank=True, null=True)
    configurations = models.JSONField(blank=True, null=True)
    is_AR = models.BooleanField(default=False)

    price = models.DecimalField(max_digits=10, decimal_places=2) 
    stock = models.PositiveIntegerField(default=0) 

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")

    brand = models.CharField(max_length=100, blank=True, null=True)
    frame_material = ArrayField(models.CharField(max_length=50), blank=True, default=list)
    color = ArrayField(models.CharField(max_length=50), blank=True, default=list)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='U')
    tag = models.CharField(max_length=50, blank=True, null=True)

    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.category.name}"  

class Order(models.Model):
    PAYMENT_METHODS = [
        ('cod', 'Cash on Delivery'),
        ('card', 'Credit/Debit Card'),
    ]
    order_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    instructions = models.TextField(blank=True, null=True)
    discount_code = models.CharField(max_length=50, blank=True, null=True)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, default='cod')

    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="Pending")

    def __str__(self):
        return f"Order #{self.id} - {self.name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def get_total(self):
        return self.price * Decimal(self.quantity)

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"
    
# models.py

class Address(models.Model):
    ADDRESS_TYPES = [
        ('Home', 'Home'),
        ('Work', 'Work'),
        ('Other', 'Other'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='addresses')
    type = models.CharField(max_length=20, choices=ADDRESS_TYPES, default='Home')
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.type}"  # Changed from username to email

    class Meta:
        verbose_name_plural = "Addresses"


class Favourite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favourites')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"


class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount = models.CharField(max_length=100)  # e.g., "20% off" or "$10 off"
    discount_type = models.CharField(max_length=20, choices=[('percentage', 'Percentage'), ('fixed', 'Fixed')])
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    max_uses = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code