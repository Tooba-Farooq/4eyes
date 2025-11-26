from django.contrib import admin

# Register your models here.


# apis/admin.py
from django.contrib import admin
from .models import Category, Product, HeroSlide, Order, OrderItem, Coupon, Favourite, Address

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(HeroSlide)
admin.site.register(Order)
admin.site.register(OrderItem)


