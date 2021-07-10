from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase

from base.exceptions import InvalidTemporaryTokenError
from base.models import TemporaryToken

User = get_user_model()


class EmptyTemporaryTokenManagerCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user")

    def test_create_not_replace(self):
        with self.assertNumQueries(2):
            TemporaryToken.objects.create_or_replace(self.user)
        self.assertEqual(TemporaryToken.objects.count(), 1)

    def test_exchange(self):
        with self.assertNumQueries(1), self.assertRaises(TemporaryToken.DoesNotExist):
            TemporaryToken.objects.exchange("")


class TemporaryTokenManagerCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user")
        self.temporary_token = TemporaryToken.objects.create(user=self.user)

    def test_replace_not_create(self):
        with self.assertNumQueries(2):
            TemporaryToken.objects.create_or_replace(self.user)
        self.assertEqual(TemporaryToken.objects.count(), 1)

    @patch.object(TemporaryToken, "has_expired", lambda _: False)
    def test_exchange(self):
        with self.assertNumQueries(3):
            token, _ = TemporaryToken.objects.exchange(self.temporary_token.key)
        self.assertEqual(token.user, self.user)

    @patch.object(TemporaryToken, "has_expired", lambda _: True)
    def test_exchange_with_expired_token(self):
        with self.assertNumQueries(1), self.assertRaises(InvalidTemporaryTokenError):
            TemporaryToken.objects.exchange(self.temporary_token.key)
