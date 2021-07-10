from django.db import models


class TemporaryTokenManager(models.Manager):
    def create_or_replace(self, user):
        self.filter(user=user).delete()
        return self.create(user=user)
