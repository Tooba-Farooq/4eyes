from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)  
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

GENDER_CHOICES = [
    ('M', 'Men'),
    ('F', 'Women'),
    ('U', 'Unisex'),
]

class Product(models.Model):
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

    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.category.name}"


