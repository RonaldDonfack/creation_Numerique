from django.urls import path
from . import views

urlpatterns = [
    path('restocard/', views.RestoCardListCreate.as_view(), name='restocard-view-create')
]