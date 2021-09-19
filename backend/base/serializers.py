from django.contrib.auth import get_user_model
from rest_framework import serializers

from base.models import Lecture, Position

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email"]


class PositionSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Position
        fields = ["id", "user", "ip", "latitude", "longitude", "created"]


class LectureSerializer(serializers.ModelSerializer):
    course = serializers.ReadOnlyField(source="course.name")
    weekday = serializers.ReadOnlyField(source="get_weekday_display")

    class Meta:
        model = Lecture
        fields = ["id", "course", "weekday", "start", "duration"]


class LectureAttendanceSerializer(LectureSerializer):
    class Meta(LectureSerializer.Meta):
        fields = LectureSerializer.Meta.fields + ["end", "is_ongoing"]
