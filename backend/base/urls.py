from django.urls import path

from base.views import index, users, TokenExchangeView, LectureView, UserView

app_name = "base"

urlpatterns = [
    path("", index, name="index"),
    path("users/", users, name="users"),
    path("token-exchange/", TokenExchangeView.as_view(), name="token-exchange"),
    path("user/", UserView.as_view(), name="user"),
    path("lectures/", LectureView.as_view(), name="lectures"),
]
