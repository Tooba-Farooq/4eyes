from django.db import models
from django.contrib.postgres.fields import ArrayField
from decimal import Decimal

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




