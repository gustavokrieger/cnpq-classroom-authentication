from django.urls import path
from rest_framework.routers import SimpleRouter

from base.views import index, users, TokenExchangeView, LectureViewSet, UserView

app_name = "base"

router = SimpleRouter()
router.register(r"lectures", LectureViewSet, basename="lecture")

urlpatterns = [
    path("", index, name="index"),
    path("users/", users, name="users"),
    path("token-exchange/", TokenExchangeView.as_view(), name="token-exchange"),
    path("user/", UserView.as_view(), name="user"),
] + router.urls
