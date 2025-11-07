from django.shortcuts import render
from rest_framework import generics
from .models import RestoCard
from .serializers import RestoCardSerialiser

# Create your views here.
class RestoCardListCreate(generics.ListCreateAPIView):
    queryset = RestoCard.objects.all()
    serializer_class = RestoCardSerialiser