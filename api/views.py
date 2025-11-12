from django.shortcuts import render
from rest_framework import generics
from .models import RestoCard
from .serializers import RestoCardSerialiser

# Create your views here.
class RestoCardListCreate(generics.ListCreateAPIView):
    queryset = RestoCard.objects.all()
    serializer_class = RestoCardSerialiser

class FoodRetriveOne(generics.RetrieveAPIView):
    queryset = RestoCard.objects.all()
    serializer_class = RestoCardSerialiser
    lookup_field = "pk"

class FoodUpdateOne (generics.RetrieveUpdateAPIView):
    queryset = RestoCard.objects.all()
    serializer_class = RestoCardSerialiser
    lookup_field = "pk"

class FoodDeleteOne(generics.RetrieveDestroyAPIView):
    queryset = RestoCard.objects.all()
    serializer_class = RestoCardSerialiser
    lookup_field = "pk"

class RestoCardAllFood(generics.ListAPIView):
    queryset = RestoCard.objects.all()
    serializer_class = RestoCardSerialiser
    