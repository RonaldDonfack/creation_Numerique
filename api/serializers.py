from rest_framework import serializers 
from .models import FoodImage, RestoCard

class RestoCardSerialiser (serializers.ModelSerializer):
    class Meta : 
        model = RestoCard
        fields = ["id", "title", "description", "price", "images"]
        
class FoodImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FoodImage
        fields = ['id', 'image', 'image_url', 'uploaded_at']
    
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None
