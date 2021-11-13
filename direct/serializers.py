from rest_framework import serializers
from .models import Message
from django.contrib.auth import get_user_model
from timezone_field.rest_framework import TimeZoneSerializerField
User = get_user_model()



class UserSerializer(serializers.ModelSerializer):
    timezone = TimeZoneSerializerField()
    class Meta:
        model = User
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Message
        fields ='__all__'
