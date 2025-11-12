from django.urls import path
from . import views

urlpatterns = [
    path('allfood/', views.RestoCardAllFood.as_view(), name='restocard-list'),
    path('addfood/', views.RestoCardListCreate.as_view(), name='restocard-view-create'),
    path('food/<int:pk>/', views.FoodRetriveOne.as_view(), name='get-food'),
    path('update/<int:pk>/', views.FoodUpdateOne.as_view(), name='update-food'),
    path('delete/<int:pk>/', views.FoodDeleteOne.as_view(), name='delete-food')
]