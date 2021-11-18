from django.db import models
from users.models import *
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.
from django.db import models

# Create your models here.

class Meeting(models.Model):
    mentor = models.ForeignKey(MentorProfile, on_delete=models.CASCADE, related_name='mentor_meeting')
    mentee = models.ForeignKey(MenteeProfile, on_delete=models.CASCADE, related_name='mentee_meeting')
    channel = models.TextField()
    meeting_title = models.TextField(null=True,blank=True)
    meeting_subject = models.TextField(null=True,blank=True)
    start_time = models.TimeField(null=True,blank=True)
    end_time = models.TimeField(null=True,blank=True)
    date = models.DateField(null=True,blank=True)
    meeting_request = models.ForeignKey(MentorRequest, on_delete=models.CASCADE, related_name='meeting_request',null=True,blank=True)
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='content_meeting',null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed = models.BooleanField(default=False,null=True,blank=True)

    class Meta:
        ordering = ('-created_at',)


