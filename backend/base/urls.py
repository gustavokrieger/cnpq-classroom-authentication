from django.urls import path

from base.views import index, users, TokenExchangeView, LectureView

app_name = "base"

urlpatterns = [
    path("", index, name="index"),
    path("users/", users, name="users"),
    path("token-exchange/", TokenExchangeView.as_view(), name="token-exchange"),
    path("lecture/<int:pk>/", LectureView.as_view(), name="lecture"),
]
