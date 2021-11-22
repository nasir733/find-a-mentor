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
    mentor_time_slot = models.ForeignKey(MentorRequestTimeSlot, on_delete=models.CASCADE,null=True,blank=True)
    
    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return self.meeting_title

class MeetingRecording(models.Model):
    mentor = models.ForeignKey(MentorProfile, on_delete=models.CASCADE, related_name='mentor_meeting_recording')
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='meeting_recording')
    recording_url = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='content_meeting_recording',null=True,blank=True)
    sid = models.TextField(null=True,blank=True)
    resourceId = models.TextField(null=True,blank=True)
    stopresponse = models.JSONField(null=True,blank=True)

    def __str__(self):
        return self.mentor.user.username