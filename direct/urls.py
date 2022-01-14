from django.urls import path
from .views import *

app_name = "directs"
urlpatterns = [
    path('room/<str:username>/', Directs, name='room'),
    path('messages/<int:room_id>/', SendDirect, name='send_direct'),

    path('userrooms/', userrooms, name='userrooms'),
]
