from django.urls import path
from . import views
app_name = 'mentor'
urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login, name='login'),
    path('register/', views.mentorregister, name='register'),
    path('profile/', views.profile, name='profile'),
    path('clippedcontent/', views.clippedcontent, name='clippedcontent'),
    path('search/', views.search, name='search'),
    path('mymentees/', views.mymentees, name='mymentees'),
    path('startmeeting/', views.startmeeting, name='joinmeeting'),
    path('mycontent/', views.mycontent, name='mycontent'),
    path('mentorpage/', views.mentorpage, name='mentorpage'),
]
