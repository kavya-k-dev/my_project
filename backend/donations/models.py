from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

class Donation(models.Model):
    donor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='donations')
    food_item = models.CharField(max_length=255)
    quantity = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    image = models.ImageField(upload_to='food_images/', blank=True, null=True)
    address = models.TextField()
    status = models.CharField(max_length=20, default='AVAILABLE')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.food_item} - {self.quantity}"


class Delivery(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Assignment'),
        ('ASSIGNED', 'Assigned to Volunteer'),
        ('PICKED_UP', 'Picked Up'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    donation = models.OneToOneField(Donation, on_delete=models.CASCADE, related_name='delivery')
    volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='deliveries'
    )
    pickup_address = models.TextField(blank=True, default='')
    dropoff_address = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    assigned_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Deliveries"

    def __str__(self):
        return f"Delivery for {self.donation.food_item} ({self.status})"


# Automatically create a Delivery record whenever a new Donation is saved
@receiver(post_save, sender=Donation)
def create_delivery_for_donation(sender, instance, created, **kwargs):
    if created:
        Delivery.objects.create(
            donation=instance,
            pickup_address=instance.address
        )