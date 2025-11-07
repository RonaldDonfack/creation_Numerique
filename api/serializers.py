from rest_framework import serializers 
from .models import RestoCard

class RestoCardSerialiser (serializers.ModelSerializer):
    class Meta : 
        model = RestoCard
        fields = ["id", "title", "description", "price", "imgUrl"]