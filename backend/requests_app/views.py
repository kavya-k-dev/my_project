from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import FoodRequest
from .serializers import FoodRequestSerializer
from donations.models import Donation

class RequestCreateListView(generics.ListCreateAPIView):
    serializer_class = FoodRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'NGO':
            return FoodRequest.objects.filter(ngo=user)
        # Donors see requests made for their donations
        return FoodRequest.objects.filter(donation__donor=user)

    def perform_create(self, serializer):
        donation = serializer.validated_data['donation']
        donation.status = Donation.Status.REQUESTED
        donation.save()
        serializer.save(ngo=self.request.user)

class RequestStatusUpdateView(generics.UpdateAPIView):
    queryset = FoodRequest.objects.all()
    serializer_class = FoodRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        food_request = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in [FoodRequest.RequestStatus.ACCEPTED, FoodRequest.RequestStatus.REJECTED]:
            food_request.status = new_status
            food_request.save()
            
            # Sync donation status
            donation = food_request.donation
            if new_status == FoodRequest.RequestStatus.ACCEPTED:
                donation.status = Donation.Status.ACCEPTED
            elif new_status == FoodRequest.RequestStatus.REJECTED:
                donation.status = Donation.Status.AVAILABLE
            donation.save()

            return Response(FoodRequestSerializer(food_request).data)
        
        return Response({'error': 'Invalid status update'}, status=status.HTTP_400_BAD_REQUEST)