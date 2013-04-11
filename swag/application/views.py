from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response
from django.http import (HttpResponseRedirect, Http404, HttpResponse)
from django.shortcuts import (render, get_object_or_404)
from application.models import GameInstance
from application.models import Vacancy
from application.models import ApplicationDocument
from form import ContactInformation
from form import UploadFileForm
from django.conf import settings
import uuid
import json
import mimetypes
from django.views.decorators.csrf import csrf_exempt
from database_storage import DatabaseStorage
from django.template import RequestContext


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
    context = dict(request)

    contact_info = ContactInformation()

    form = UploadFileForm(initial={'title': 'cv'})
    context.update({'instance_id': game.uid, 'form': form, 'contact_info': contact_info})

    return render_to_response("index.html", context)


def show_uploaded_file(request, filename):
    filename = settings.DBS_OPTIONS['base_url'] + filename
    storage = DatabaseStorage(options=settings.DBS_OPTIONS)
    image_file = storage.open(filename, 'rb')
    if not image_file:
        raise Http404
    file_content = image_file.read()

    content_type, content_encoding = mimetypes.guess_type(filename)
    response = HttpResponse(content=file_content, mimetype=content_type)
    response['Content-Disposition'] = 'inline; filename=%s' % filename
    if content_encoding:
        response['Content-Encoding'] = content_encoding
    return response


def handle_uploaded_file(submitted_file, title, unique_id):

    game = GameInstance.objects.get(uid=unique_id)
    name = "{name}-{title}".format(name=game.playerName, title=title)

    print(game)
    application_document = ApplicationDocument()
    try:
        application_document = get_object_or_404(ApplicationDocument, game_instance=game)
    except Http404:
        application_document.game_instance = game
        application_document.title = name
        submitted_file.name = "{uid}-{filename}".format(uid=unique_id, filename=submitted_file.name)

        application_document.attachment = submitted_file
        application_document.save()
        return True

    return False




@csrf_exempt
def process_contact(request, unique_id):

    game = GameInstance.objects.get(uid=unique_id)
    form = ContactInformation(request.POST)
    upload_state = {"action": "contact", 'success': 'Thx for submitting!'}

    if form.is_valid():
        game.playerName = form.cleaned_data['name']
        game.playerEmail = form.cleaned_data['email']
        game.save()
        print("PROCESS CONTACT")
    else:
        error = form.errors
        upload_state['success'] = json.dumps(error)

    return render(request, "results_template.js", upload_state, content_type=RequestContext(request))


@csrf_exempt
def process_upload(request, unique_id):

    upload_state = {"action": "file_upload", 'success': 'false'}
    if not request.method == "POST":
        return render(request, "results_template.js", upload_state, content_type="application/json")

    print request.POST

    form = UploadFileForm(request.POST, request.FILES)
    if form.is_valid():
        print 'form is valid'
        upload_success = handle_uploaded_file(request.FILES['file'], form.cleaned_data['title'], unique_id)
        if upload_success:
            upload_state['success'] = 'Thanks for submitting'
        else:
            upload_state['success'] = 'did you try to re-upload? Thats not possible at the moment!'
    else:
        upload_state['success'] = json.dumps(form.errors)

    return render(request, "results_template.js", upload_state, content_type="text/html")
