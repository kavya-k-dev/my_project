from django.contrib import admin
from .models import Donation, Delivery

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('id', 'food_item', 'quantity', 'donor', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('food_item', 'donor__username', 'address')


@admin.action(description='Reset to Pending (Remove assigned volunteer)')
def detach_volunteer(modeladmin, request, queryset):
    queryset.update(volunteer=None, status='PENDING')


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('id', 'donation', 'volunteer', 'status', 'pickup_address', 'updated_at')
    list_filter = ('status',)
    search_fields = ('donation__food_item', 'volunteer__username', 'pickup_address')
    actions = [detach_volunteer]