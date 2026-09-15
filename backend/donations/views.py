from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Donation

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    return Response({'message': 'User registered successfully', 'username': user.username}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_donation(request):
    food_item = request.data.get('food_item')
    quantity = request.data.get('quantity')
    phone = request.data.get('phone', '')
    donor_name = request.data.get('donor_name') or 'Anonymous'
    image = request.FILES.get('image')

    if not food_item or not quantity:
        return Response({'error': 'Food item and quantity are required'}, status=status.HTTP_400_BAD_REQUEST)

    donor_user, _ = User.objects.get_or_create(username=donor_name)

    donation = Donation.objects.create(
        donor=donor_user,
        food_item=food_item,
        quantity=quantity,
        phone=phone,
        image=image if image else None,
        status='available'
    )

    return Response({'message': 'Donation created successfully', 'id': donation.id}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_summary(request):
    total_donations = Donation.objects.count()
    active_users = User.objects.count()
    
    # Strictly count DELIVERED items as delivered
    successfully_delivered = Donation.objects.filter(status__startswith='DELIVERED').count()
    
    # Everything else (available, CLAIMED, IN_TRANSIT) is pending/in-progress
    in_transit_pending = total_donations - successfully_delivered

    donations_qs = Donation.objects.all().order_by('-id')
    donations_data = []

    for d in donations_qs:
        image_url = None
        if hasattr(d, 'image') and d.image:
            image_url = request.build_absolute_uri(d.image.url)

        donations_data.append({
            'id': d.id,
            'donor_id': d.donor.id if d.donor else None,
            'donor_name': d.donor.username if d.donor else 'Anonymous',
            'food_item': d.food_item,
            'quantity': d.quantity,
            'status': d.status,
            'phone': getattr(d, 'phone', ''),
            'image_url': image_url,
        })

    return Response({
        'stats': {
            'activeUsers': active_users,
            'totalDonations': total_donations,
            'inTransitPending': in_transit_pending,
            'successfullyDelivered': successfully_delivered,
        },
        'donations': donations_data
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def claim_donation(request, donation_id):
    try:
        donation = Donation.objects.get(id=donation_id)
        recipient_name = request.data.get('recipient_name', 'Claimed')
        donation.status = f"CLAIMED by {recipient_name}"
        donation.save()
        return Response({'message': 'Donation claimed successfully'}, status=status.HTTP_200_OK)
    except Donation.DoesNotExist:
        return Response({'error': 'Donation not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def update_status(request, donation_id):
    try:
        donation = Donation.objects.get(id=donation_id)
        new_status = request.data.get('status')
        if not new_status:
            return Response({'error': 'Status required'}, status=status.HTTP_400_BAD_REQUEST)
        
        donation.status = new_status
        donation.save()
        return Response({'message': f'Status updated to {new_status}'}, status=status.HTTP_200_OK)
    except Donation.DoesNotExist:
        return Response({'error': 'Donation not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_donation(request, donation_id):
    try:
        donation = Donation.objects.get(id=donation_id)
        donation.delete()
        return Response({'message': 'Donation deleted successfully'}, status=status.HTTP_200_OK)
    except Donation.DoesNotExist:
        return Response({'error': 'Donation not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)