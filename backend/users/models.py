from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        DONOR = 'DONOR', 'Donor'
        NGO = 'NGO', 'NGO'
        ADMIN = 'ADMIN', 'Admin'

    role = models.CharField(
        max_length=10, 
        choices=Role.choices, 
        default=Role.DONOR
    )
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"