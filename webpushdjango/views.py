import json

from django.conf import settings
from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from webpush import send_group_notification


@require_GET
def home(request):
    webpush_settings = getattr(settings, 'WEBPUSH_SETTINGS', {})
    vapid_key = webpush_settings.get('VAPID_PUBLIC_KEY')
    user = request.user
    return render(request, 'home.html', {user: user, 'vapid_key': vapid_key})


@require_POST
@csrf_exempt
def send_push(request):
    try:
        body = request.body
        data = json.loads(body)

        if 'head' not in data and 'body' not in data:
            return JsonResponse(status=400, data={"message": "Invalid data format"})

        payload = {'head': data['head'], 'body': data['body']}

        send_group_notification("all", payload=payload, ttl=1000)

        return JsonResponse(status=200, data={"message": "Web push successful"})

    except TypeError:
        return JsonResponse(status=500, data={"message": "An error occurred"})
