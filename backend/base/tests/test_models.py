from datetime import timedelta
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase

from base.models import TemporaryToken

User = get_user_model()


class TemporaryTokenCase(TestCase):
    def setUp(self):
        user = User.objects.create_user(username="user")
        self.temporary_token = TemporaryToken.objects.create(user=user)

    def test_has_not_expired(self):
        now = self.temporary_token.created + timedelta(minutes=7)
        with patch("django.utils.timezone.now", return_value=now):
            self.assertFalse(self.temporary_token.is_expired())

    def test_has_expired(self):
        now = self.temporary_token.created + timedelta(minutes=15, milliseconds=1)
        with patch("django.utils.timezone.now", return_value=now):
            self.assertTrue(self.temporary_token.is_expired())
