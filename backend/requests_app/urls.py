from django.urls import path
from .views import RequestCreateListView, RequestStatusUpdateView

urlpatterns = [
    path('', RequestCreateListView.as_view(), name='request_list_create'),
    path('<int:pk>/status/', RequestStatusUpdateView.as_view(), name='request_status_update'),
]