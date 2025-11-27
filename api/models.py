from django.db import models
from datetime import date
from django.utils.timezone import now


class RestoCard(models.Model):
    title = models.CharField(max_length=99)
    description = models.TextField()
    price = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return self.title

class FoodImage(models.Model):
    food = models.ForeignKey(RestoCard, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='food_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.food.title}"