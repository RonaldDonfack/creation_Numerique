from django.urls import path
from . import views

urlpatterns = [
    path('food/', views.RestoCardFood.as_view(), name='resto-card-food'),
    path('food/<int:pk>/', views.RestoCardFood.as_view(), name='resto-card-food-detail'),
    
    path('addfood/', views.RestoCardListCreate.as_view(), name='resto-card-list-create'),
    
    
    path('<int:pk>/update/', views.FoodUpdateOne.as_view(), name='food-update-one'),
    path('<int:pk>/delete/', views.FoodDeleteOne.as_view(), name='food-delete-one'),
]