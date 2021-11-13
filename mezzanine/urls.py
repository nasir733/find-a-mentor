from django.conf.urls import url
from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from django.conf import settings
from django.conf.urls.static import static
import notifications.urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('mentor/', include('mentor.urls')),
    path('direct/',include('direct.urls')),
    url('^inbox/notifications/', include(notifications.urls, namespace='notifications')),
] 

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
