from django.urls import path
from . import views
app_name = 'mentor'
urlpatterns = [
    
    path('login/', views.login, name='login'),
    path('register/', views.mentorregister, name='register'),
    
    path('', views.home, name='home'),
    path('browse/',views.browsecontent, name='browse'),
    path('browse/<str:category>/',views.catergorycontent, name='catergorycontent'),
    path('browse/<str:category>/<str:tag>/',views.tagcontent, name='tagcontent'),
    path('browsetags/',views.browsetags,name='browsetags'),
    path('profile/', views.profile, name='profile'),
    path('clippedcontent/', views.clippedcontent, name='clippedcontent'),
    path('search/', views.search, name='search'),
    path('mymentees/', views.mymentees, name='mymentees'),
    path('startmeeting/', views.startmeeting, name='joinmeeting'),
    path('mycontent/', views.mycontent, name='mycontent'),
    path('mentorpage/', views.mentorpage, name='mentorpage'),
    path('mentorpage/<str:task>/', views.mentorpage, name='mentorpage'),
    path('settings/', views.settings, name='settings'),
    path('content/<int:id>/',views.singlecontent, name='content'),
    path('public/<str:username>/', views.publicprofile, name='public'),
    path('menteerequests/<str:view>/', views.menteerequests, name='menteerequests'),
    path('acceptrequest/<int:request_id>/',views.acceptrequest,name='acceptrequest'),
    path('declinerequest/<int:request_id>/',views.declinerequest,name='declinerequest'),
    path('addworkinghours/',views.addworkinghours,name="addworkinghours"),
    path('addworkinghours/<int:id>/',views.deleteworkinghours,name="deleteworkinghours"),
    path('content/<int:id>/addtags',views.addtagcontent, name='addtag'),
    path('content/<int:id>/update',views.singlecontentupdate, name='contentupdate'),

    path('findmentees/',views.findmentees,name='findmentees'),
    path('findmentees/<str:category>/',views.catergorymentee, name='catergorymentee'),
    path('findmentees/<str:category>/<str:tag>/',views.tagmentee, name='tagmentee'),
    path('browsementeetags/',views.browsementeetags,name='browsementeetags'),
]
