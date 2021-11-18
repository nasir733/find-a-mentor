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
    path('browse/<str:category>/',views.catergorycontent, name='catergorycontent'),
    path('browse/<str:category>/<str:tag>/',views.tagcontent, name='tagcontent'),
    path('browsetags/',views.browsetags,name='browsetags'),
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
    path('checkworkhours/<int:content_id>/',views.checkworkhours, name='checkworkhours'),
    path('addfavouritetags/',views.addfavouritetags, name='addfavouritetags'),
    path('completedsessions/',views.completedsessions, name='completedsessions'),

    path('skills_json/',views.skills_json, name='skills_json'),
]
