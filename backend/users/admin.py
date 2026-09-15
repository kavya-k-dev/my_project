from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'role', 'phone', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Details', {'fields': ('role', 'phone', 'address', 'latitude', 'longitude')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)