from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path(r"saml2/", include("djangosaml2.urls")),
]
