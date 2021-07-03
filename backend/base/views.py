from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.template import loader


def index(request):
    if request.user.is_authenticated:
        # return redirect("/users")
        return redirect(f"http://{settings.DOMAIN}:3000/")
    return render(request, "base/index.html")


@login_required
def users(request):
    template = loader.get_template("base/users.html")
    meta = request.META
    return HttpResponse(template.render(meta, request))
