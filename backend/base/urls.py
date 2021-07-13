from django.urls import path

from . import views

app_name = "base"
urlpatterns = [
    path("", views.index, name="index"),
    path("users/", views.users, name="users"),
    path("token-exchange/", views.TokenExchangeView.as_view(), name="token-exchange"),
    path("home/", views.Home.as_view(), name="home"),
]
