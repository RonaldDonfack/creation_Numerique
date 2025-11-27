from django.shortcuts import render
from rest_framework import generics, status
from .models import FoodImage, RestoCard
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import RestoCardSerialiser
from rest_framework.views import APIView
from rest_framework.response import Response 

# Create your views here.
class RestoCardFood(APIView):
    def get(self, request, pk=None, format=None):
        if pk:
            try: 
                food = RestoCard.objects.filter(id=pk)
                if not food.exists():
                    return Response({"error": "Food item not found"}, status=status.HTTP_404_NOT_FOUND)
                serializer = RestoCardSerialiser(food, many=True)
            except ValueError:
                return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            food = RestoCard.objects.all()
            serializer = RestoCardSerialiser(food, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class RestoCardListCreate(generics.ListCreateAPIView):
    queryset = RestoCard.objects.all()
    serializer_class = RestoCardSerialiser
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        # Create the RestoCard entry first
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        food = serializer.save()

        # Handle multiple images
        files = request.FILES.getlist('images')  # "images" is the field name in Postman/Frontend

        for f in files:
            FoodImage.objects.create(food=food, image=f)

        return Response(RestoCardSerialiser(food, context={'request': request}).data, status=201)
class FoodUpdateOne(APIView):
    def get(self, request, pk=None, format=None):
        if pk:
            try: 
                food = RestoCard.objects.get(id=pk)
                serializer = RestoCardSerialiser(food)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except RestoCard.DoesNotExist:
                return Response({"error": "Food item not found"}, status=status.HTTP_404_NOT_FOUND)
            except ValueError:
                return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "ID parameter required"}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk=None, format=None):
        if pk:
            try: 
                food = RestoCard.objects.get(id=pk)
                serializer = RestoCardSerialiser(food, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except RestoCard.DoesNotExist:
                return Response({"error": "Food item not found"}, status=status.HTTP_404_NOT_FOUND)
            except ValueError:
                return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "ID parameter required"}, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk=None, format=None):
        if pk:
            try: 
                food = RestoCard.objects.get(id=pk)
                serializer = RestoCardSerialiser(food, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except RestoCard.DoesNotExist:
                return Response({"error": "Food item not found"}, status=status.HTTP_404_NOT_FOUND)
            except ValueError:
                return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "ID parameter required"}, status=status.HTTP_400_BAD_REQUEST)


class FoodDeleteOne(APIView):
    def get(self, request, pk=None, format=None):
        if pk:
            try: 
                food = RestoCard.objects.get(id=pk)
                serializer = RestoCardSerialiser(food)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except RestoCard.DoesNotExist:
                return Response({"error": "Food item not found"}, status=status.HTTP_404_NOT_FOUND)
            except ValueError:
                return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "ID parameter required"}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None, format=None):
        if pk:
            try: 
                food = RestoCard.objects.get(id=pk)
                food.delete()
                return Response({"message": "Food item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
            except RestoCard.DoesNotExist:
                return Response({"error": "Food item not found"}, status=status.HTTP_404_NOT_FOUND)
            except ValueError:
                return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "ID parameter required"}, status=status.HTTP_400_BAD_REQUEST)