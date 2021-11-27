from django.db import models

# Create your models here.


class DashboardVideo(models.Model):
    video=models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)
