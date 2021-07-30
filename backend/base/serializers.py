from django.contrib.auth import get_user_model
from rest_framework import serializers

from base.models import Lecture

User = get_user_model()


class TokenExchangeSerializer(serializers.Serializer):
    temporary_token = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email"]


class LectureSerializer(serializers.ModelSerializer):
    course = serializers.ReadOnlyField(source="course.name")
    weekday = serializers.ReadOnlyField(source="get_weekday_display")

    class Meta:
        model = Lecture
        fields = ["id", "course", "weekday", "start", "duration"]
