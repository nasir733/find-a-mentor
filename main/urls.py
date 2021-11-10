from django.urls import path
from . import views
from django.conf import settings
import debug_toolbar
from django.urls import include, path
from django.conf.urls.static import static
urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('case_studies/', views.case_studies, name='case_studies'),
    path('contact/', views.contact, name='contact'),
    path('send_email/', views.send_email, name='send_mail'),
    path('sendesta/', views.sendesta, name='sendesta'),
    path('vukode/', views.vukode, name='vukode'),
    path('bradstreet/', views.bradstreet, name='bradstreet'),
    path('ziteso/', views.ziteso, name='ziteso'),
    path('services/', views.services, name='services'),
    path('team/', views.team, name='team'),
    path('testimonial/', views.testimonial, name='testimonial'),
    path('__debug__/', include(debug_toolbar.urls)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
