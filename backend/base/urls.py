from django.urls import path
from rest_framework.routers import SimpleRouter

from base import views

app_name = "base"

router = SimpleRouter()
router.register(r"users", views.UserViewSet, basename="user")
router.register(r"positions", views.PositionViewSet, basename="position")
router.register(r"lectures", views.LectureViewSet, basename="lecture")

urlpatterns = [
    path("token-exchange/", views.TokenExchangeView.as_view(), name="token-exchange"),
] + router.urls
