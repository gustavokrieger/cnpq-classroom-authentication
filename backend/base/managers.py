from django.db import models
from rest_framework.authtoken.models import Token


class TemporaryTokenManager(models.Manager):
    def create_or_replace(self, user):
        self.filter(user=user).delete()
        return self.create(user=user)

    def exchange(self, key):
        temporary_token = self.get(key=key)
        temporary_token.check_if_valid()
        return self._replace_with_permanent(temporary_token)

    @staticmethod
    def _replace_with_permanent(temporary_token):
        user = temporary_token.user
        temporary_token.delete()
        return Token.objects.create(user=user)


class LectureQuerySet(models.QuerySet):
    def for_courses(self, courses):
        return self.filter(course__in=courses)
