from rest_framework import serializers

from base.models import Lecture


class TokenExchangeSerializer(serializers.Serializer):
    temporary_token = serializers.CharField(write_only=True)


class LectureSerializer(serializers.ModelSerializer):
    course = serializers.ReadOnlyField(source="course.name")

    class Meta:
        model = Lecture
        fields = ["id", "course", "weekday", "start", "duration"]
