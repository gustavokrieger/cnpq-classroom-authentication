from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from rest_framework.authtoken.models import Token

from base.exceptions import InvalidTemporaryTokenError
from base.managers import TemporaryTokenManager

User = get_user_model()


class TemporaryToken(Token):
    lifespan = models.DurationField(default=timedelta(seconds=300))

    objects = TemporaryTokenManager()

    def check_if_valid(self):
        if self._has_expired():
            raise InvalidTemporaryTokenError("expired token")

    def _has_expired(self):
        return timezone.now() > self.created + self.lifespan


class CourseClass(models.Model):
    users = models.ManyToManyField(User, related_name="course_classes", through="Presence")
    course = models.CharField(max_length=50)
    start = models.TimeField()
    end = models.TimeField()


class Presence(models.Model):
    user = models.ForeignKey(User, models.PROTECT)
    course_class = models.ForeignKey(CourseClass, models.PROTECT)
