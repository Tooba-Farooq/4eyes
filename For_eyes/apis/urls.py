from django.urls import path
from . import views

urlpatterns = [
    path('hero-slides/', views.hero_slides, name='hero-slides'),
    path('featured-products/', views.featured_products, name='featured-products'),
    path('categories/', views.category_list, name='category-list'),
    path('products/<int:pk>/', views.product_detail, name='product-detail'),
    path('products/', views.product_list, name='product-list'),
    path('place-order/', views.place_order, name='place-order'),
    path('place-order/', views.place_order),
    path('create-checkout-session/', views.create_checkout_session),
    path('stripe-webhook/', views.stripe_webhook),
    path('search/', views.search_products, name='search_products'),
    path('my-orders/', views.my_orders, name='my-orders'),
    path('my-addresses/', views.my_addresses, name='my-addresses'),
    path('addresses/<int:pk>/', views.address_detail, name='address-detail'),
    path('my-favourites/', views.my_favourites, name='my-favourites'),
    path('favourite-ids/', views.get_favourite_ids, name='favourite-ids'),
    path('add-to-favourites/', views.add_to_favourites, name='add-to-favourites'),
    path('remove-from-favourites/<int:product_id>/', views.remove_from_favourites, name='remove-from-favourites'),
    path('my-coupons/', views.my_coupons, name='my-coupons'),
    path('profile/', views.user_profile, name='user-profile'),
    path('change-password/', views.change_password, name='change-password'),
   
]