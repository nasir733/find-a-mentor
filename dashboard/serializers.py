from rest_framework import serializers
from users.models import *

class MentorRequestTimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorRequestTimeSlot
        fields = '__all__'