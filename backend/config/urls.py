from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication
    path('api/auth/', include('users.urls')),

    # Donations
    path('api/donations/', include('donations.urls')),

    # Food requests
    path('api/requests/', include('requests_app.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)