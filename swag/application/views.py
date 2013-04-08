# from django.template import Context
# from django.template import loader
# from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from application.models import GameInstance
from application.models import Vacancy
import uuid


def index(request):
    vacancies = Vacancy.objects.all().order_by('title')
    return render_to_response('list_vacancies.html', {
        'vacancies': vacancies
    })


def start_game(request, vacancy_id):
    vacancy = Vacancy.objects.get(id=vacancy_id)
    instance_id = str(uuid.uuid4()).replace('-', '')
    print instance_id

    game_instance = GameInstance()
    game_instance.uid = instance_id
    game_instance.vacancy = vacancy
    game_instance.save()

    return HttpResponseRedirect(reverse('play', args=(instance_id,)))


def play(request, unique_id):
    # get instance:
    game = GameInstance.objects.get(uid=unique_id)
    print 'My instance is: %s' % game

    return render_to_response("index.html", {})


# def vote(request, poll_id):
#     p = get_object_or_404(Poll, pk=poll_id)
#     try:
#         selected_choice = p.choice_set.get(pk=request.POST['choice'])
#     except (KeyError, Choice.DoesNotExist):
#         # Redisplay the poll voting form.
#         return render(request, 'polls/detail.html', {
#             'poll': p,
#             'error_message': "You didn't select a choice.",
#         })
#     else:
#          += 1
#         selected_choice.save()
#         # Always return an HttpResponseRedirect after successfully dealing
#         # with POST data. This prevents data from being posted twice if a
#         # user hits the Back button.
#         return HttpResponseRedirect(reverse('polls:results', args=(p.id,)))

# def upload_file(request):
#     if request.method == 'POST':
#         form = UploadFileForm(request.POST, request.FILES)
#         if form.is_valid():
#             handle_uploaded_file(request.FILES['file'])
#             return HttpResponseRedirect('/success/url/')
#     else:
#         form = UploadFileForm()
#     return render_to_response('list.html', {'form': form})
    

# def handle_uploaded_file(f):
#     with open('some/file/name.txt', 'wb+') as destination:
#         for chunk in f.chunks():
#             destination.write(chunk)
