from django.contrib import admin

# Register your models here.

# apis/admin.py
from django.contrib import admin
from .models import Category, Product

admin.site.register(Category)
admin.site.register(Product)

