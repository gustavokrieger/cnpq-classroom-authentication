from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.datetime_safe import time
from rest_framework.authtoken.models import Token

from base.models import Course, Lecture

User = get_user_model()


# TODO: remove.
class Command(BaseCommand):
    @transaction.atomic
    def handle(self, *args, **options):
        # 1
        aluno = User.objects.create_user(
            "ca0cd09a12abade3bf0777574d9f987f@cafeexpresso.rnp.br",
            email="aluno.gidlab@idp.cafeexpresso.rnp.br",
            first_name="Aluno",
            last_name="GIdLab",
        )
        Token.objects.get_or_create(user=aluno)
        aluno.password = ""
        aluno.save(update_fields=["password"])

        algoritmos, _ = Course.objects.get_or_create(name="Algoritmos")
        algoritmos.users.add(aluno)
        redes_2, _ = Course.objects.get_or_create(name="Redes 2")
        redes_2.users.add(aluno)
        calculo, _ = Course.objects.get_or_create(name="Calculo")
        calculo.users.add(aluno)

        for weekday in range(7):
            Lecture.objects.get_or_create(
                course=calculo,
                weekday=weekday,
                start=time(hour=16),
                duration=timedelta(hours=7, minutes=59),
            )
            Lecture.objects.get_or_create(
                course=redes_2,
                weekday=weekday,
                start=time(hour=8),
                duration=timedelta(hours=7, minutes=59),
            )
            Lecture.objects.get_or_create(
                course=algoritmos,
                weekday=weekday,
                start=time(hour=0),
                duration=timedelta(hours=7, minutes=59),
            )
