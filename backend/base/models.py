from datetime import timedelta, datetime

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from rest_framework.authtoken.models import Token

from base.exceptions import InvalidTemporaryTokenError
from base.managers import (
    TemporaryTokenManager,
    LectureQuerySet,
    AttendanceManager,
    AttendanceQuerySet,
)


# https://docs.djangoproject.com/en/3.0/topics/auth/customizing/#using-a-custom-user-model-when-starting-a-project
class User(AbstractUser):
    pass


class TemporaryToken(Token):
    lifespan = models.DurationField(default=timedelta(seconds=300))

    objects = TemporaryTokenManager()

    def check_if_valid(self):
        if self._has_expired():
            raise InvalidTemporaryTokenError("expired token")

    def _has_expired(self):
        return timezone.now() > self.created + self.lifespan


class Position(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, models.PROTECT, related_name="positions"
    )
    ip = models.GenericIPAddressField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        return str(self.created)


class Course(models.Model):
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="courses")
    name = models.CharField(max_length=50, unique=True)

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
        settings.AUTH_USER_MODEL, related_name="attendances", through="Attendance"
    )
    weekday = models.IntegerField(choices=Weekday.choices)
    start = models.TimeField()
    duration = models.DurationField()

    objects = LectureQuerySet.as_manager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["course", "weekday"], name="unique_course_lecture_per_weekday"
            ),
        ]

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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.PROTECT)
    lecture = models.ForeignKey(Lecture, models.PROTECT)
    registered = models.DateField(auto_now_add=True)

    objects = AttendanceManager.from_queryset(AttendanceQuerySet)()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "lecture", "registered"],
                name="unique_attendance_per_day",
            ),
        ]

    def __str__(self):
        return str(self.registered)
