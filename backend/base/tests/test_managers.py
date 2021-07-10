from django.contrib.auth import get_user_model
from django.test import TestCase

from base.models import TemporaryToken

User = get_user_model()


class EmptyTemporaryTokenManagerCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user")

    def test_create_not_replace(self):
        with self.assertNumQueries(2):
            TemporaryToken.objects.create_or_replace(self.user)
        self.assertEqual(TemporaryToken.objects.count(), 1)


class TemporaryTokenManagerCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="user")
        TemporaryToken.objects.create(user=self.user)

    def test_replace_not_create(self):
        with self.assertNumQueries(2):
            TemporaryToken.objects.create_or_replace(self.user)
        self.assertEqual(TemporaryToken.objects.count(), 1)
