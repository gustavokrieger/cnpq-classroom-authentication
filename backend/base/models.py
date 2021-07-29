from datetime import timedelta, datetime

from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from rest_framework.authtoken.models import Token

from base.exceptions import InvalidTemporaryTokenError
from base.managers import TemporaryTokenManager, LectureQuerySet, AttendanceQuerySet

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

    def __str__(self):
        return self.name


class Lecture(models.Model):
    # Indexes replicate those of datetime.
    class Weekday(models.IntegerChoices):
        MONDAY = 0
        TUESDAY = 1
        WEDNESDAY = 2
        THURSDAY = 3
        FRIDAY = 4
        SATURDAY = 5
        SUNDAY = 6

    course = models.ForeignKey(Course, models.PROTECT, related_name="lectures")
    attendances = models.ManyToManyField(
        User, related_name="attendances", through="Attendance"
    )
    weekday = models.IntegerField(choices=Weekday.choices)
    start = models.TimeField()
    duration = models.DurationField()

    objects = LectureQuerySet.as_manager()

    def __str__(self):
        return f"{self.get_weekday_display()}, {self.start}"

    def is_ongoing(self):
        now = datetime.now()
        if now.weekday() != self.weekday:
            return False
        start = datetime.combine(now.date(), self.start)
        end = start + self.duration
        if start <= now < end:
            return True
        return False


class Attendance(models.Model):
    user = models.ForeignKey(User, models.PROTECT)
    lecture = models.ForeignKey(Lecture, models.PROTECT)
    created = models.DateTimeField(auto_now_add=True)

    objects = AttendanceQuerySet.as_manager()

    def __str__(self):
        return str(self.created)
