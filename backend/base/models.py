from datetime import timedelta

from django.db import models
from django.utils import timezone
from rest_framework.authtoken.models import Token

from base.managers import TemporaryTokenManager


class TemporaryToken(Token):
    lifespan = models.DurationField(default=timedelta(seconds=900))

    objects = TemporaryTokenManager()

    def is_expired(self):
        return timezone.now() > self.created + self.lifespan
