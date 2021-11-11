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
    path('mentorpage/<str:task>/', views.mentorpage, name='mentorpage'),
    path('browse/',views.browsecontent, name='browse'),
    path('settings/', views.settings, name='settings'),
    path('content/<int:id>/',views.singlecontent, name='content'),
    path('public/<str:username>/', views.publicprofile, name='public'),
    path('menteerequests/<str:view>/', views.menteerequests, name='menteerequests'),
    path('acceptrequest/<int:request_id>/',views.acceptrequest,name='acceptrequest'),
    path('declinerequest/<int:request_id>/',views.declinerequest,name='declinerequest'),
]
