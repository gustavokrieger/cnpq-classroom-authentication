from django.db import models


class LectureQuerySet(models.QuerySet):
    def for_courses(self, courses):
        return self.filter(course__in=courses)

    def on_weekday(self, weekday):
        return self.filter(weekday=weekday)

    def by_start(self):
        return self.order_by("start")


class AttendanceManager(models.Manager):
    def register(self, user, lecture):
        if not lecture.is_ongoing():
            raise ValueError
        return self.create(user=user, lecture=lecture)
