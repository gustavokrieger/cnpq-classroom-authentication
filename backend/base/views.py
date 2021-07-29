from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.template import loader
from django.utils.http import urlencode
from rest_framework import permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from base.models import TemporaryToken, Lecture, Attendance
from base.serializers import TokenExchangeSerializer, LectureSerializer, UserSerializer

User = get_user_model()


def index(request):
    if request.user.is_authenticated:
        # return redirect("/users")
        temporary_token = TemporaryToken.objects.create_or_replace(request.user)
        query_string = urlencode({"temporary_token": temporary_token})
        return redirect(f"http://{settings.DOMAIN}:3000/?{query_string}")
    return render(request, "base/index.html")


@login_required
def users(request):
    template = loader.get_template("base/users.html")
    meta = request.META
    return HttpResponse(template.render(meta, request))


class TokenExchangeView(APIView):
    def post(self, request):
        serializer = TokenExchangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        temporary_token_key = serializer.validated_data["temporary_token"]
        token = TemporaryToken.objects.exchange(temporary_token_key)
        return Response({"token": token.key})


class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class LectureViewSet(mixins.ListModelMixin, GenericViewSet):
    serializer_class = LectureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_courses = self.request.user.courses.all()
        return Lecture.objects.for_courses(user_courses).select_related("course")

    @action(methods=["post"], detail=True)
    def attend(self, request, pk=None):
        instance = self.get_object()
        Attendance.objects.register(request.user, instance)
        return Response({"status": "attendance registered"})
