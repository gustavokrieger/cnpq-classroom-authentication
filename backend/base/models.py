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


class Course(models.Model):
    users = models.ManyToManyField(User, related_name="courses")
    name = models.CharField(max_length=50)


class Lecture(models.Model):
    course = models.ForeignKey(Course, models.PROTECT, related_name="lectures")
    start = models.DateTimeField()
    duration = models.DurationField()


class Presence(models.Model):
    user = models.ForeignKey(User, models.PROTECT, related_name="presences")
    lecture = models.ForeignKey(Lecture, models.PROTECT, related_name="presences")
