from django.db import models

from django.db.models import Max
from django.contrib.auth import get_user_model
User = get_user_model()
# Create your models here.

class Room(models.Model):
	name = models.CharField(max_length=255)
	description = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	mentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='firstuser_rooms',null=True,blank=True)
	mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seconduser_rooms',null=True,blank=True)	
	is_new_message = models.BooleanField(default=True)
	menter_username = models.CharField(max_length=255,null=True,blank=True)
	mentee_username = models.CharField(max_length=255,null=True,blank=True)

	
	def __str__(self):
		return self.name

class Message(models.Model):
	text = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message')
	room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='room')
	user_name=models.CharField(max_length=255,null=True,blank=True)

	
	def __str__(self):
		return self.text