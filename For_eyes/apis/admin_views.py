from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.db.models import Sum, Count, Avg, F, Q
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone
from datetime import timedelta
from .models import Order, Product, OrderItem, Favourite
import json

@staff_member_required
def analytics_dashboard(request):
    # Date ranges
    today = timezone.now()
    last_30_days = today - timedelta(days=30)
    last_60_days = today - timedelta(days=60)
    last_7_days = today - timedelta(days=7)
    
    # Order Analytics
    all_orders = Order.objects.all()
    recent_orders = all_orders.filter(created_at__gte=last_30_days)
    previous_period_orders = all_orders.filter(created_at__gte=last_60_days, created_at__lt=last_30_days)
    
    # Calculate percentage changes
    current_revenue = recent_orders.aggregate(total=Sum('total_amount'))['total'] or 0
    previous_revenue = previous_period_orders.aggregate(total=Sum('total_amount'))['total'] or 0
    revenue_change = ((current_revenue - previous_revenue) / previous_revenue * 100) if previous_revenue > 0 else 0
    
    current_order_count = recent_orders.count()
    previous_order_count = previous_period_orders.count()
    order_change = ((current_order_count - previous_order_count) / previous_order_count * 100) if previous_order_count > 0 else 0
    
    order_stats = {
        'total_orders': all_orders.count(),
        'total_revenue': all_orders.aggregate(total=Sum('total_amount'))['total'] or 0,
        'average_order_value': all_orders.aggregate(avg=Avg('total_amount'))['avg'] or 0,
        'orders_last_30_days': current_order_count,
        'revenue_last_30_days': current_revenue,
        'pending_orders': all_orders.filter(status='Pending').count(),
        'confirmed_orders': all_orders.filter(status='Confirmed').count(),
        'revenue_change': round(revenue_change, 1),
        'order_change': round(order_change, 1),
    }
    
    # Product Analytics
    products = Product.objects.all()
    product_stats = {
        'total_products': products.count(),
        'low_stock': products.filter(stock__lte=5, stock__gt=0).count(),
        'out_of_stock': products.filter(stock=0).count(),
        'featured_products': products.filter(is_featured=True).count(),
        'total_inventory_value': products.aggregate(
            total=Sum(F('price') * F('stock'))
        )['total'] or 0,
    }
    
    # Best Selling Products
    best_sellers = OrderItem.objects.values(
        'product__name', 'product__id'
    ).annotate(
        total_sold=Sum('quantity'),
        revenue=Sum(F('quantity') * F('price'))
    ).order_by('-total_sold')[:10]
    
    # Daily Sales (Last 30 days) for Chart
    daily_sales = Order.objects.filter(
        created_at__gte=last_30_days
    ).annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        orders=Count('id'),
        revenue=Sum('total_amount')
    ).order_by('date')
    
    # Prepare data for revenue chart
    revenue_chart_data = {
        'labels': [sale['date'].strftime('%b %d') for sale in daily_sales],
        'data': [float(sale['revenue']) for sale in daily_sales]
    }
    
    # Order Status Distribution for Pie Chart
    status_distribution = all_orders.values('status').annotate(
        count=Count('id')
    ).order_by('-count')
    
    status_chart_data = {
        'labels': [item['status'] for item in status_distribution],
        'data': [item['count'] for item in status_distribution]
    }
    
    # Payment Method Distribution
    payment_distribution = all_orders.values('payment_method').annotate(
        count=Count('id')
    )
    
    payment_chart_data = {
        'labels': [dict(Order.PAYMENT_METHODS).get(item['payment_method'], item['payment_method']) for item in payment_distribution],
        'data': [item['count'] for item in payment_distribution]
    }
    
    # Category Performance
    category_performance = OrderItem.objects.values(
        'product__category__name'
    ).annotate(
        revenue=Sum(F('quantity') * F('price')),
        units_sold=Sum('quantity')
    ).order_by('-revenue')[:8]
    
    category_chart_data = {
        'labels': [item['product__category__name'] for item in category_performance],
        'data': [float(item['revenue']) for item in category_performance]
    }
    
    # Gender Preference
    gender_preference = OrderItem.objects.values(
        'product__gender'
    ).annotate(
        count=Sum('quantity')
    )
    
    gender_labels = {'M': 'Men', 'F': 'Women', 'U': 'Unisex'}
    gender_chart_data = {
        'labels': [gender_labels.get(item['product__gender'], 'Unknown') for item in gender_preference],
        'data': [item['count'] for item in gender_preference]
    }
    
    # Top Products for Bar Chart
    top_products_chart = {
        'labels': [item['product__name'][:20] for item in best_sellers[:8]],
        'data': [float(item['revenue']) for item in best_sellers[:8]]
    }
    
    # Most Favorited Products
    most_favorited = Favourite.objects.values(
        'product__name'
    ).annotate(
        count=Count('id')
    ).order_by('-count')[:10]
    
    # Low Stock Alerts
    low_stock_products = products.filter(stock__lte=5).order_by('stock')[:10]
    
    context = {
        'order_stats': order_stats,
        'product_stats': product_stats,
        'best_sellers': best_sellers,
        'daily_sales': list(daily_sales),
        'most_favorited': most_favorited,
        'low_stock_products': low_stock_products,
        
        # Chart data as JSON
        'revenue_chart_data': json.dumps(revenue_chart_data),
        'status_chart_data': json.dumps(status_chart_data),
        'payment_chart_data': json.dumps(payment_chart_data),
        'category_chart_data': json.dumps(category_chart_data),
        'gender_chart_data': json.dumps(gender_chart_data),
        'top_products_chart': json.dumps(top_products_chart),
    }
    
    return render(request, 'admin/analytics_dashboard.html', context)