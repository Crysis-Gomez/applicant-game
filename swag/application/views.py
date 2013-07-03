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
from application.models import PortfolioLink
from application.models import SkillSet
from application.models import PlayerSkill
from application.models import Question
from application.models import PlayerQuestion
from form import ContactInformationForm
from form import UploadFileForm
from form import MeetingForm
from form import PortfolioForm
from form import SkillSetForm
from form import Answer
from django.conf import settings
import uuid
import json
import mimetypes
import sys
from django.views.decorators.csrf import csrf_exempt
from database_storage import DatabaseStorage
from django.template import RequestContext
from django.core.mail import BadHeaderError
from django.core.mail import send_mail
from django.forms.models import inlineformset_factory
from django.db import IntegrityError


def index(request):
    vacancies = Vacancy.objects.all().order_by('title')

    return render_to_response('list_vacancies.html', {
        'vacancies': vacancies
    })


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    print ip
    return ip

def show_choice(request):

    return render_to_response('choice.html')

def start_game(request, slug):
    _vacancy = Vacancy.objects.get(slug=slug)
    instance_id = str(uuid.uuid4()).replace('-', '')

    game_instance = GameInstance()
    game_instance.uid = instance_id
    game_instance.vacancy = _vacancy
    game_instance.save()
    return HttpResponseRedirect(reverse('play', args=(instance_id,)))
    # return HttpResponseRedirect(reverse('choice'))


def statejs(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    skills = json.dumps(dict(game.get_all_skills()))
    links = json.dumps(game.get_all_links())
    question = json.dumps(game.vacancy.question.question)
    ip = get_client_ip(request)

    context = {
        'game': game,
        'skills': skills,
        'links': links,
        'question': question,
        'ip': ip
    }
    return render(request, "state.js", context, content_type="application/javascript")


@csrf_exempt
def process_boss(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    game.player_unlocked_boss = True
    game.save()
    return HttpResponse('All went well')


def gamejs(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    context = {'game': game}
    return render(request, "game.js", context, content_type="application/javascript")


def playerdatajs(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    context = {'game': game}
    return render(request, "playerdata.js", context, content_type="application/javascript")


@csrf_exempt
def unlock_cv_quest(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    game.player_cv_unlockedQuest = True
    game.save()
    return HttpResponse('All went well')


@csrf_exempt
def unlock_motivation_quest(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    game.player_motivation_unlockedQuest = True
    game.save()
    return HttpResponse('All went well')


@csrf_exempt
def unlock_link_quest(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    game.player_link_unlockedQuest = True
    game.save()
    return HttpResponse('All went well')


@csrf_exempt
def unlock_skill_quest(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    game.player_skill_unlockedQuest = True
    game.save()
    return HttpResponse('All went well')

# def getQuestData(request, unique_id):
#     game = GameInstance.objects.get(uid=unique_id)
#     context = {'game': game}
#     cvUnlocked = get_cv_questUnlocked(game)
#     context.update({'cv_quest_unlocked': cvUnlocked})

#     return render(request, "playerdatajs", context, content_type="application/javascript")


def get_skill(game, skill):
    try:
        obj = PlayerSkill.objects.get(game_instance=game, skill=skill)
    except PlayerSkill.DoesNotExist:
        obj = PlayerSkill()
    return obj


def process_profile(request, unique_id):
    context = dict()
    game = get_object_or_404(GameInstance, uid=unique_id)
    skills = game.get_all_skills()
    links = game.get_all_links()
    context.update({
        'game': game,
        'skills': skills,
        'links': links})
    return render_to_response("profile.html", context)


@csrf_exempt
def play(request, unique_id):
    try:
        game = get_object_or_404(GameInstance, uid=unique_id)
    except Http404:
        return HttpResponseRedirect('/')

    context = dict()
    if game.get_contact() is False:
        contact_info = ContactInformationForm()
        context.update({'contact_info': contact_info})

    letter = LetterForm(initial={'title': 'motivation'})
    context.update({'letter': letter})

    meetingList = Meeting.objects.filter(vacancy=game.vacancy)
    context.update({'meeting': meetingList})

    portfolio = PortfolioForm()

    skillForm = SkillSetForm(elements=game.vacancy.skill_sets)

    answer = Answer()

    context.update({'skill': skillForm})

    _ip = get_client_ip(request)

    #print sys.argv[-1]


    form = UploadFileForm(initial={'title': 'cv'})
    context.update({
        'game': game,
        'portfolio': portfolio,
        'answer': answer,
        'form': form})
    return render_to_response("index.html", context)


@csrf_exempt
def process_intro(request, unique_id):

    game = get_object_or_404(GameInstance, uid=unique_id)
    if request.method == "POST":
        game.player_finished_intro = True
        game.save()

    return HttpResponse('All went well')


@csrf_exempt
def process_answer(request, unique_id):

    game = get_object_or_404(GameInstance, uid=unique_id)
    upload_state = {"action": "answer", 'success': 'Thanks for submitting'}
    if request.method == "POST":
        ans = Answer(request.POST)
        if ans.is_valid():
            print  "test"
            # player_question, created = PlayerQuestion.objects.get_or_create(game_instance=game, question=game.vacancy.question)
            # player_question.answer = ans.cleaned_data['answer']
            #player_question.save()
            #process_second_mail(request, game)
        else:
            upload_state['success'] = json.dumps(ans.errors)

    return render(request, "results_template.js", upload_state, content_type=RequestContext(request))



@csrf_exempt
def process_skills(request, unique_id):

    game = get_object_or_404(GameInstance, uid=unique_id)

    if request.method == "POST":
        skillForm = SkillSetForm(request.POST, elements=game.vacancy.skill_sets)
        if skillForm.is_valid():
            for data in skillForm.cleaned_data:
                _skill = SkillSet.objects.get(title=data)
                skill_set = get_skill(game, _skill)
                skill_set.score = skillForm.cleaned_data[data]
                skill_set.game_instance = game
                skill_set.skill = _skill
                skill_set.save()

            skills = json.dumps(dict(game.get_all_skills()))
            links = json.dumps(game.get_all_links())
        else:
            print(skillForm.errors)

    upload_state = {'skills': skills, 'links': links}
    return render(request, "update_player.js", upload_state, content_type=RequestContext(request))


def update_state(request, game):
    context = dict()
    context.update({'game': game})
    return render(request, "state.js", context, content_type="application/javascript")


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





@csrf_exempt
def process_links(request, unique_id):
    link_list = str(request.POST.get('list')).split(",")
    game = GameInstance.objects.get(uid=unique_id)
    for _link in link_list:
        if not 'http://' or not 'https://' in _link:
            _link = 'http://' + _link

        port = PortfolioLink()
        port.links = _link
        port.game_instance = game
        port.save()

    skills = json.dumps(dict(game.get_all_skills()))
    links = json.dumps(game.get_all_links())

    upload_state = {'skills': skills, 'links': links}
    return render(request, "update_player.js", upload_state, content_type=RequestContext(request))



# @csrf_exempt
# def process_mail(request, unique_id):
#     game = GameInstance.objects.get(uid=unique_id)

#     game.player_defeated_boss = True
#     game.save()
#     # subject = request.POST.get('subject', 'Hello')
#     # message = request.POST.get('message', game.vacancy.mail_text)
#     # from_email = request.POST.get('from_email', 'Crysis.gomez@gmail.com')

#     #recipients = [settings.DEFAULT_FROM_EMAIL]

#     #send_mail('New article:', message, recipients, ['Crysis.gomez@gmail.com'], fail_silently=False)
#     subject = game.vacancy.title
#     message = game.vacancy.mail_text
#     send_mail(subject, message, settings.DEFAULT_FROM_EMAIL,
#         [game.player_email], fail_silently=False)
#     return HttpResponse('All went well')
#     # if subject and message and from_email:
#     #     try:
#     #         send_mail(subject, message, from_email, ['Jerry.Gomez@spilgames.com'])
#     #     except BadHeaderError:
#     #         return HttpResponse('Invalid header found.')
#     #     return HttpResponse('All went well')
#     # else:
#     #     # In reality we'd use a form class
#     #     # to get proper validation errors.
#     #     return HttpResponse('Make sure all fields are entered and valid.')



@csrf_exempt
def process_meeting(request, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    meeting = Meeting()
    upload_state = {"action": "meeting", 'success': 'Thanks for submitting'}

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
    upload_state = {"action": "motivation", 'success': 'Thanks for submitting'}

    if not form.is_valid():
        error = form.errors
        print error
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


def process_first_mail(request, game):

    subject = game.vacancy.title
    message = game.vacancy.mail_text
    link = get_current_path(request)
    link = sys.argv[-1]+link['current_path']
    game_link = link.replace("uploadcontact", "game")
    profile_link = link.replace("uploadcontact", "getprofile")
    message = message.replace("link1", "http://" + game_link)
    message = message.replace("link2", "http://" + profile_link)
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL,
    [game.player_email], fail_silently=False)


def process_second_mail(request, game):

    subject = game.vacancy.title
    message = game.vacancy.mail_text2
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL,
    [game.player_email], fail_silently=False)


@csrf_exempt
def process_contact(request, unique_id):

    game = GameInstance.objects.get(uid=unique_id)
    form = ContactInformationForm(request.POST)
    upload_state = {"action": "contact", 'success': 'Thanks for submitting', 'playername': 'name', 'playeremail': 'email'}

    if form.is_valid():
        game.player_name = form.cleaned_data['name']
        game.player_email = form.cleaned_data['email']
        game.save()
        upload_state['playername'] = json.dumps(game.player_name)
        upload_state['playeremail'] = json.dumps(game.player_email)
        process_first_mail(request, game)
    else:
        print(form.errors)
        upload_state['success'] = json.dumps(form.errors)

    return render(request, "results_template.js", upload_state, content_type=RequestContext(request))


def get_current_path(request):
    return{
        'current_path':	request.get_full_path()
    }


@csrf_exempt
def handle_uploaded_motivation(submitted_file, title, unique_id):
    game = GameInstance.objects.get(uid=unique_id)
    name = "{name}-{title}".format(name=game.player_name, title=title)
    motivation_letter,created = MotivationLetter.objects.get_or_create(game_instance=game)

    motivation_letter.game_instance = game
    motivation_letter.title = name
    submitted_file.name = "{uid}-{filename}".format(uid=unique_id, filename=submitted_file.name)
    motivation_letter.attachment = submitted_file
    motivation_letter.save()
    return True



@csrf_exempt
def process_motivation_upload(request, unique_id):

    upload_state = {"action": "file_upload", 'success': 'Current field is empty'}
    if not request.method == "POST":
        return render(request, "results_template.js", upload_state, content_type="application/json")

    if request.FILES.get("attachment"):
        form = UploadFileForm()
        form.document = request.FILES['attachment']
        upload_success = True
        upload_success = handle_uploaded_motivation(form.document, form.document.name, unique_id)

        if upload_success:
            upload_state['success'] = 'Thanks for submitting'
    return render(request, "results_template.js", upload_state, content_type="text/html")



def handle_uploaded_file(submitted_file, title, unique_id,request):

    game = GameInstance.objects.get(uid=unique_id)
    name = "{name}-{title}".format(name=game.player_name, title=title)
    response_data = ''

    application_document = CvDocument()
    try:
        application_document = get_object_or_404(CvDocument, game_instance=game)
    except Http404:
        application_document.game_instance = game
        application_document.title = name
        submitted_file.name = "{uid}-{filename}".format(uid=unique_id, filename=submitted_file.name)
        print dir(submitted_file)
        application_document.attachment = submitted_file
        application_document.save()

        result = []
        result.append({"name":  name,
                       "size": submitted_file.size,
                       "url": '',
                       "thumbnail_url": '',
                       "delete_url": '',
                       "delete_type": "POST", })

        response_data = json.dumps({'files': result})

    if "application/json" in request.META['HTTP_ACCEPT_ENCODING']:
            mimetype = 'application/json'
    else:
            mimetype = 'text/plain'

    return HttpResponse(response_data, mimetype=mimetype)




@csrf_exempt
def process_upload(request, unique_id):

    upload_state = {"action": "file_upload", 'success': 'false'}
    if not request.method == "POST":
        return render(request, "results_template.js", upload_state, content_type="application/json")

    form = UploadFileForm(request.POST, request.FILES)
    if form.is_valid():
        upload_success = handle_uploaded_file(request.FILES['document'], form.cleaned_data['title'], unique_id,request)
        upload_state['success'] = 'Thanks for submitting'
    else:
        print(form.errors)
        upload_state['success'] = json.dumps(form.errors)


    #     #checking for json data type
    #     #big thanks to Guy Shapiro
    #     if "application/json" in request.META['HTTP_ACCEPT_ENCODING']:
    #         mimetype = 'application/json'
    #     else:
    #         mimetype = 'text/plain'
    #     return HttpResponse(response_data, mimetype=mimetype)
    # else: #GET
    #     return HttpResponse('Only POST accepted')

    return render(request, "results_template.js", upload_state, content_type="text/html")
