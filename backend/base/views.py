from datetime import date

from django.contrib.auth import get_user_model
from django.db import IntegrityError
from rest_framework import permissions, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from base.models import TemporaryToken, Lecture, Attendance, Position
from base.serializers import (
    TokenExchangeSerializer,
    UserSerializer,
    LectureSerializer,
    LectureAttendanceSerializer,
    PositionSerializer,
)

User = get_user_model()


class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# TODO: add permission_classes.
class UserViewSet(GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"

    @action(detail=True)
    def positions(self, request, username=None):
        user = self.get_object()
        positions = user.positions.all()
        serializer = PositionSerializer(positions, many=True)
        return Response(serializer.data)


class TokenExchangeView(APIView):
    def post(self, request):
        serializer = TokenExchangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        temporary_token_key = serializer.validated_data["temporary_token"]
        token = TemporaryToken.objects.exchange(temporary_token_key)
        return Response({"token": token.key})


class PositionViewSet(
    mixins.CreateModelMixin,
    GenericViewSet,
):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = [permissions.IsAuthenticated]


class LectureViewSet(GenericViewSet):
    serializer_class = LectureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_courses = self.request.user.courses.all()
        return Lecture.objects.for_courses(user_courses).select_related("course")

    @action(detail=False)
    def today(self, request):
        weekday = date.today().weekday()
        queryset = self.get_queryset().on_weekday(weekday).by_start()
        context = {"request": request}
        serializer = LectureAttendanceSerializer(queryset, many=True, context=context)
        return Response(serializer.data)

    @action(methods=["post"], detail=True)
    def attend(self, request, pk=None):
        instance = self.get_object()
        try:
            Attendance.objects.register(request.user, instance)
        except IntegrityError:
            return Response(
                {"status": "attendance already registered today"},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        return Response({"status": "attendance registered"})
