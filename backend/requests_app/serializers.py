from rest_framework import serializers
from .models import FoodRequest
from donations.serializers import DonationSerializer

class FoodRequestSerializer(serializers.ModelSerializer):
    ngo_name = serializers.ReadOnlyField(source='ngo.username')
    donation_detail = DonationSerializer(source='donation', read_only=True)

    class Meta:
        model = FoodRequest
        fields = ['id', 'donation', 'donation_detail', 'ngo', 'ngo_name', 'status', 'notes', 'created_at']
        read_only_fields = ['ngo', 'status', 'created_at']