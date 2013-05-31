from django.conf.urls import patterns, url
# from django.views.generic import DetailView, ListView
from application import views

# from polls.models import Poll
# from django.utils import timezone
from django.conf import settings
upload_url = settings.DBS_OPTIONS['base_url'][1:]

urlpatterns = patterns(
    '',
    url(r'^$', views.index, name='index'),
    url(r'^start_game/(?P<slug>[a-zA-Z\-0-9]+)/$', 'application.views.start_game', name='game'),
    url(r'^game/(?P<unique_id>\w+)/$', views.play, name='play'),
    url(r'^(?P<unique_id>\w+)/game.js', views.gamejs, name='init'),
    url(r'^(?P<unique_id>\w+)/playerdata.js', views.playerdatajs, name='playerdata'),
    url(r'^(?P<unique_id>\w+)/state.js', views.statejs, name='playerstate'),
    url(r'^submitfile/(?P<unique_id>\w+)/', views.process_upload, name='submitfile'),
    #url(r'^uploadQuest/(?P<unique_id>\w+)/', views.sendQuestData, name='submitquest'),
    url(r'^submitmeeting/(?P<unique_id>\w+)/', views.process_meeting, name='submitmeeting'),
    url(r'^uploadcontact/(?P<unique_id>\w+)/', views.process_contact, name='submitcontact'),
    url(r'^mail/(?P<unique_id>\w+)/', views.process_mail, name='submitmail'),
    url(r'^uploadmotivation/(?P<unique_id>\w+)/', views.process_motivation_letter, name='submitmotivation'),
    url(r'^uploadlinks/(?P<unique_id>\w+)/', views.process_links, name='submitlinks'),
    url(r'^uploadskills/(?P<unique_id>\w+)/', views.process_skills, name='submitskills'),
    url(r'^getprofile/(?P<unique_id>\w+)/', views.process_profile, name='submitprofile'),
    url(r'^cvquest/(?P<unique_id>\w+)/', views.unlock_cv_quest, name='submit_cv_quest'),
    url(r'^motivationquest/(?P<unique_id>\w+)/', views.unlock_motivation_quest, name='submit_motivation_quest'),
    url(r'^linkquest/(?P<unique_id>\w+)/', views.unlock_link_quest, name='submit_link_quest'),
    url(r'^skillquest/(?P<unique_id>\w+)/', views.unlock_skill_quest, name='submit_skill_quest'),

    url(r'^uploadfilemotivation/(?P<unique_id>\w+)/', views.process_motivation_upload, name='submitmotivationfile'),
    url(r'^' + upload_url + '(?P<filename>[a-zA-Z\-0-9\.\_]+)', views.show_uploaded_file, name="file_show")
    #submit form
)
