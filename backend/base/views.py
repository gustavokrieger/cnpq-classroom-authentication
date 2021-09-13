from datetime import date

from django.contrib.auth import get_user_model, logout
from django.http import Http404
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_422_UNPROCESSABLE_ENTITY
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


# TODO: add permission_classes.
class UserViewSet(GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"
    lookup_value_regex = "[^/]+"

    @action(detail=False, permission_classes=[IsAuthenticated])
    def self(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(methods=["put"], detail=False, url_path="self/log-out", permission_classes=[IsAuthenticated])
    def self_log_out(self, request):
        user = request.user
        logout(request)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=True, url_path="last-position", serializer_class=PositionSerializer)
    def last_position(self, request, username=None):
        user = self.get_object()
        try:
            position = user.positions.latest()
        except Position.DoesNotExist:
            raise Http404
        serializer = self.get_serializer(position)
        return Response(serializer.data)

    @action(methods=["post"], detail=True, url_path="log-out")
    def log_out(self, request, username=None):
        user = self.get_object()
        user.log_out()
        serializer = self.get_serializer(user)
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
    permission_classes = [IsAuthenticated]


class LectureViewSet(GenericViewSet):
    serializer_class = LectureSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_courses = self.request.user.courses.all()
        return Lecture.objects.for_courses(user_courses).select_related("course")

    @action(detail=False)
    def today(self, request):
        weekday = date.today().weekday()
        queryset = self.get_queryset().on_weekday(weekday).by_start()
        serializer = LectureAttendanceSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=["post"], detail=True)
    def attend(self, request, pk=None):
        lecture = self.get_object()
        try:
            Attendance.objects.register(request.user, lecture)
        except ValueError:
            data = {"status": "lecture is not ongoing"}
            return Response(data, status=HTTP_422_UNPROCESSABLE_ENTITY)
        return Response({"status": "attendance registered"})
