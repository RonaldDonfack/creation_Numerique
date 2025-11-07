from django.db import models

# Create your models here.
class RestoCard(models.Model): 
    title  = models.CharField(max_length=99)
    description = models.TextField()
    price = models.IntegerField(max_length=8)
    imgUrl = models.TextField()
   