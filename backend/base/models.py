from datetime import timedelta

from django.db import models
from django.utils.timezone import now
from rest_framework.authtoken.models import Token

from base.managers import TemporaryTokenManager


class TemporaryToken(Token):
    lifespan = models.DurationField(default=timedelta(seconds=900))

    objects = TemporaryTokenManager()

    def has_expired(self):
        return now() > self.created + self.lifespan
