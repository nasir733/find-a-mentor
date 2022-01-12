from rest_framework.serializers import ModelSerializer
from .models import MeetingRecording


class MeetingSerializer(ModelSerializer):
    class Meta:
        model = MeetingRecording
        fields = "__all__"
