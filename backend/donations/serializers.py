from rest_framework import serializers
from .models import Donation, Delivery

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = '__all__'

class DeliverySerializer(serializers.ModelSerializer):
    donation_details = DonationSerializer(source='donation', read_only=True)

    class Meta:
        model = Delivery
        fields = '__all__'