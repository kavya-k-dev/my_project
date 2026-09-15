from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('create/', views.create_donation, name='create_donation'),
    path('admin-summary/', views.admin_summary, name='admin_summary'),
    path('claim/<int:donation_id>/', views.claim_donation, name='claim_donation'),
    path('status/<int:donation_id>/', views.update_status, name='update_status'),
    path('delete/<int:donation_id>/', views.delete_donation, name='delete_donation'),
    path('delete-user/<int:user_id>/', views.delete_user, name='delete_user'),
]