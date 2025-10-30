from django.urls import path
from . import views

urlpatterns = [
    path('hero-slides/', views.hero_slides, name='hero-slides'),
    path('featured-products/', views.featured_products, name='featured-products'),
    path('categories/', views.category_list, name='category-list'),
    path('products/<int:pk>/', views.product_detail, name='product-detail'),

]
