from django.urls import path
from . import views
from django.conf.urls import url
from django.contrib.auth.decorators import login_required

app_name = 'dashboard'

urlpatterns = [
    path('login/', views.menteelogin, name='menteelogin'),
    path('register/', views.menteeregister, name='menteeregister'),
    path('logout/', views.Logout, name='logout'),
    
    path('', views.menteedashboard, name='home'),
    path('browse/',views.browsecontent, name='browse'),
    path('profile/', views.profile, name='profile'),
    path('mymentors/', views.mymentors, name='mymentors'),
    path('settings/', views.settings, name='settings'),
    path('findamentor/', views.findamentor, name='findamentor'),
    path('search/', views.search, name='search'),
    path('joinmeeting/', views.joinmeeting, name='joinmeeting'),
    path('mentorcontent/', views.mentorcontent, name='mycontent'),
    path('content/<int:id>/',views.singlecontent, name='content'),
    path('addreview/<int:content_id>/',views.addreview, name='addreview'),
    path('requestcontent/<int:content_id>/',views.requestcontent, name='requestcontent'),
]
