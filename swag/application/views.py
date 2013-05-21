from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response
from django.http import (HttpResponseRedirect, Http404, HttpResponse)
from django.shortcuts import (render, get_object_or_404)
from application.models import GameInstance
from application.models import Vacancy
from application.models import CvDocument
from application.models import MotivationLetter
from application.form import LetterForm
from application.models import Meeting

from form import ContactInformationForm
from form import UploadFileForm
from form import MeetingForm
from django.conf import settings
import uuid
import json
import mimetypes
from django.views.decorators.csrf import csrf_exempt
from database_storage import DatabaseStorage
from django.template import RequestContext


def get_contact_info(game):
    return 'no' if not game.player_name and not game.player_email else 'yes'


def get_cv_questUnlocked(game):
    return game.player_cv_unlockedQuest


def get_motivation_questUnlock(game):
    return game.player_motivation_uplockedQuest


def index(request):
    vacancies = Vacancy.objects.all().order_by('title')
    return render_to_response('list_vacancies.html', {
        'vacancies': vacancies
    })


def start_game(request, slug):
    _vacancy = Vacancy.objects.get(slug=slug)
    instance_id = str(uuid.uuid4()).replace('-', '')

    game_instance = GameInstance()
    game_instance.uid = instance_id
    game_instance.vacancy = _vacancy
    game_instance.save()

    return HttpResponseRedirect(reverse('play', args=(instance_id,)))


def gamejs(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    cv_unlock = get_cv_questUnlocked(game)
    motivation_unlock = get_motivation_questUnlock(game)
    context = {'game': game}
    context.update({
        'cv_unlock': cv_unlock,
        'motivation_unlock': motivation_unlock})

    return render(request, "game.js", context, content_type="application/javascript")


def playerdatajs(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    context = {'game': game}

    contact_info = get_contact_info(game)
    # print game.player_email, game.player_name
    context.update({
        'contact_info': contact_info,
        'has_motivation_letter': game.has_motivation,
        'has_cv': game.has_cv})

    # print 'Contact info: %s' % contact_info

    return render(request, "playerdata.js", context, content_type="application/javascript")


@csrf_exempt
def sendQuestData(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    data = request.POST['quest_id']
    upload_state = {"action": "contact", 'success': 'Thx for submitting!', 'playername': 'name'}
    getQuest(data, game)
    game.save()

    return render(request, "results_template.js", upload_state, content_type=RequestContext(request))


def getQuest(id_quest, game):

    if id_quest == "1":
        game.player_cv_unlockedQuest = True
    elif id_quest == "2":
        game.player_motivation_uplockedQuest = True

    game.save()

# def getQuestData(request, unique_id):
#     game = GameInstance.objects.get(uid=unique_id)
#     context = {'game': game}
#     cvUnlocked = get_cv_questUnlocked(game)
#     context.update({'cv_quest_unlocked': cvUnlocked})

#     return render(request, "playerdatajs", context, content_type="application/javascript")


def play(request, unique_id):
    try:
        game = get_object_or_404(GameInstance, uid=unique_id)
    except Http404:
        return HttpResponseRedirect('/')
    context = dict(request)

    has_contact_info = get_contact_info(game)
    if 'no' is has_contact_info:
        contact_info = ContactInformationForm()
        context.update({'contact_info': contact_info})

    letter = LetterForm(initial={'title': 'motivation'})
    context.update({'letter': letter})

    meetingList = list(Meeting.objects.all())
    context.update({'meeting': meetingList})

    form = UploadFileForm(initial={'title': 'cv'})
    context.update({
        'instance_id': game.uid,
        'form': form,
        'has_contact_info': has_contact_info,
        'has_motivation_letter': game.has_motivation,
        'has_cv': game.has_cv})

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
    name = "{name}-{title}".format(name=game.player_name, title=title)

    application_document = CvDocument()
    try:
        application_document = get_object_or_404(CvDocument, game_instance=game)
    except Http404:
        application_document.game_instance = game
        application_document.title = name
        submitted_file.name = "{uid}-{filename}".format(uid=unique_id, filename=submitted_file.name)
        application_document.attachment = submitted_file
        application_document.save()

        return True

    return False


@csrf_exempt
def process_meeting(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    meeting = Meeting()
    upload_state = {"action": "meeting", 'success': 'Thx for submitting!'}

    if request.method == 'POST':
        date_id = request.POST.get('value1')
        try:
            meeting = get_object_or_404(Meeting, dateID=date_id)
            meeting.player_name = game.player_name
            meeting.taken = True
            meeting.save()
        except Http404:
            meeting.player_name = game.player_name
            meeting.taken = True
            meeting.save()

    return render(request, "results_template.js", upload_state, content_type=RequestContext(request))


@csrf_exempt
def process_motivation_letter(request, unique_id):

    game = GameInstance.objects.get(uid=unique_id)
    form = LetterForm(request.POST)
    motivation_letter = MotivationLetter()

    upload_state = {"action": "motivation", 'success': 'Thx for submitting!'}

    if not form.is_valid():
        error = form.errors

        upload_state['success'] = json.dumps(error)
    else:
        try:
            motivation_letter = get_object_or_404(MotivationLetter, game_instance=game)
        except Http404:
            motivation_letter.entry = form.cleaned_data['entry']
            motivation_letter.game_instance = game
            motivation_letter.title = str(game.player_name) + ' - Motivation text'
            motivation_letter.save()

    return render(request, "results_template.js", upload_state, content_type=RequestContext(request))


@csrf_exempt
def process_contact(request, unique_id):

    game = GameInstance.objects.get(uid=unique_id)
    form = ContactInformationForm(request.POST)
    upload_state = {"action": "contact", 'success': 'Thx for submitting!', 'playername': 'name'}

    if form.is_valid():
        game.player_name = form.cleaned_data['name']
        game.player_email = form.cleaned_data['email']
        game.save()
        upload_state['playername'] = json.dumps(game.player_name)
    else:
        print(form.errors)
        upload_state['success'] = json.dumps(form.errors)

    return render(request, "results_template.js", upload_state, content_type=RequestContext(request))


@csrf_exempt
def handle_uploaded_motivation(submitted_file, title, unique_id):

    game = GameInstance.objects.get(uid=unique_id)
    name = "{name}-{title}".format(name=game.player_name, title=title)

    motivation_letter = MotivationLetter()

    try:
        motivation_letter = get_object_or_404(MotivationLetter, game_instance=game)
    except Http404:
        motivation_letter.game_instance = game
        motivation_letter.title = name
        submitted_file.name = "{uid}-{filename}".format(uid=unique_id, filename=submitted_file.name)
        motivation_letter.attachment = submitted_file
        motivation_letter.save()
        return True

    return False


@csrf_exempt
def process_motivation_upload(request, unique_id):

    upload_state = {"action": "file_upload", 'success': 'false'}
    if not request.method == "POST":
        return render(request, "results_template.js", upload_state, content_type="application/json")

    form = UploadFileForm(request.POST, request.FILES)
    if form.is_valid():
        upload_success = True
        upload_success = handle_uploaded_motivation(request.FILES['document'], form.cleaned_data['title'], unique_id)

        if upload_success:
            upload_state['success'] = 'Thanks for submitting'
        else:
            upload_state['success'] = 'did you try to re-upload? Thats not possible at the moment!'
    else:
        print(form.errors)
        upload_state['success'] = json.dumps(form.errors)

    return render(request, "results_template.js", upload_state, content_type="text/html")


@csrf_exempt
def process_upload(request, unique_id):

    upload_state = {"action": "file_upload", 'success': 'false'}
    if not request.method == "POST":
        return render(request, "results_template.js", upload_state, content_type="application/json")

    #print 'cv' in request.POST['title']

    form = UploadFileForm(request.POST, request.FILES)
    if form.is_valid():
        upload_success = True
        # if x[1] == "document":
        upload_success = handle_uploaded_file(request.FILES['document'], form.cleaned_data['title'], unique_id)
        #else:
           # upload_success = handle_uploaded_motivation(request.FILES['document'], form.cleaned_data['title'], unique_id)
        if upload_success:
            upload_state['success'] = 'Thanks for submitting'
        else:
            upload_state['success'] = 'did you try to re-upload? Thats not possible at the moment!'
    else:
        print(form.errors)
        upload_state['success'] = json.dumps(form.errors)

    return render(request, "results_template.js", upload_state, content_type="text/html")
