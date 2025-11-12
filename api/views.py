from django.shortcuts import render
from rest_framework import generics, status
from .models import RestoCard
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
    
    
class RestoCardListCreate(APIView):
    def get(self, request, format=None):
        food = RestoCard.objects.all()
        serializer = RestoCardSerialiser(food, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, format=None):
        serializer = RestoCardSerialiser(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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