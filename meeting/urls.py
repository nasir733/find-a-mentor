from django.urls import path
from . import views

app_name = 'meeting'

urlpatterns = [
    path('schedulemeeting/<int:mentorequest_id>/',views.schedulemeeting,name='schedulemeeting'),
    path('connectcallmentee/<int:meeting_id>/',views.connectcallmentee,name='connectcallmentee'),
    path('completemeeting/<int:meeting_id>/',views.completemeeting,name='completemeeting'),
    path('pusher/auth/', views.pusher_auth, name='agora-pusher-auth'),
    path('token/', views.generate_agora_token, name='agora-token'),
    path('callmentee/<int:meeting_id>/',views.callyourmentee,name='callyourmentee'),
    
    path('call-user/', views.call_user, name='agora-call-user'),
]
