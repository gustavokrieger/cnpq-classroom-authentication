from django.db import models
from rest_framework.authtoken.models import Token

from base.exceptions import InvalidTemporaryTokenError


class TemporaryTokenManager(models.Manager):
    def create_or_replace(self, user):
        self.filter(user=user).delete()
        return self.create(user=user)

    def exchange(self, key):
        temporary_token = self.get(key=key)
        if temporary_token.has_expired():
            raise InvalidTemporaryTokenError("expired token")
        return Token.objects.get_or_create(user=temporary_token.user)
