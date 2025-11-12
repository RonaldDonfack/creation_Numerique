from django.db import models
from datetime import date

# Create your models here.
class RestoCard(models.Model): 
    title  = models.CharField(max_length=99)
    description = models.TextField()
    price = models.IntegerField()
    imgUrl = models.TextField()
    created_at = models.DateTimeField(default=date.today())

    def __str__(self):
        # printing the title of the menu
        return self.title
   