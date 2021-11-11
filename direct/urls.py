from django.urls import path
from .views import *

app_name="directs"
urlpatterns = [
    path('directs/<str:username>/', Directs, name='direct'),
]
