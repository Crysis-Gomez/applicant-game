from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.shortcuts import render
from application.models import GameInstance
from application.models import Vacancy
from form import UploadFileForm
from django.conf import settings
import uuid
import os
import json
from django.views.decorators.csrf import csrf_exempt


def index(request):
    vacancies = Vacancy.objects.all().order_by('title')
    return render_to_response('list_vacancies.html', {
        'vacancies': vacancies
    })


def start_game(request, slug):
    _vacancy = Vacancy.objects.get(slug=slug)
    instance_id = str(uuid.uuid4()).replace('-', '')
    print _vacancy

    game_instance = GameInstance()
    game_instance.uid = instance_id
    game_instance.vacancy = _vacancy
    game_instance.save()

    return HttpResponseRedirect(reverse('play', args=(instance_id,)))


def gamejs(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)

    return render(request, "game.js", {'game': game}, content_type="application/javascript")


def play(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    context = dict(request)  # csrf(request)
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            handle_uploaded_file(request.FILES['file'], form.cleaned_data['title'])
        else:
            print(form.errors)
    else:
        form = UploadFileForm()
        context.update({'instance_id': game.uid, 'form': form})

    return render_to_response("index.html", context)


def handle_uploaded_file(submitted_file, title):
    name = "{title_name}_{filename}".format(title_name=title, filename=submitted_file.name)
    with open(os.path.join(settings.MEDIA_ROOT, name), 'wb+') as destination:
        for chunk in submitted_file.chunks():
            destination.write(chunk)


@csrf_exempt
def process_upload(request, unique_id):

    upload_state = {'success': 'false'}
    if not request.method == "POST":
        return render(request, "upload_message.js", upload_state, content_type="application/json")

    print request.POST

    form = UploadFileForm(request.POST, request.FILES)
    if form.is_valid():
        print 'form is valid'
        handle_uploaded_file(request.FILES['file'], form.cleaned_data['title'])
        upload_state['success'] = 'Thanks for submitting'
    else:
        upload_state['success'] = json.dumps(form.errors)


    return render(request, "upload_message.js", upload_state, content_type="text/html")
