from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect
from django.template import loader
from django.utils.http import urlencode
from django.views import View

from base.models import TemporaryToken


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


class TokenExchangeView(View):
    def post(self, request):
        temporary_token_key = request.POST.get("temporary_token")
        if not temporary_token_key:
            return HttpResponseBadRequest('Missing "temporary_token" in POST data.')
        token = TemporaryToken.objects.exchange(temporary_token_key)
        return HttpResponse(token)
