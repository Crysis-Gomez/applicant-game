from django.conf.urls import patterns, url
# from django.views.generic import DetailView, ListView
from application import views

# from polls.models import Poll
# from django.utils import timezone
from django.conf import settings
upload_url = settings.DBS_OPTIONS['base_url'][1:]

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^start_game/(?P<slug>[a-zA-Z\-0-9]+)/$', 'application.views.start_game', name='game'),
    url(r'^game/(?P<unique_id>\w+)/$', views.play, name='play'),
    url(r'^(?P<unique_id>\w+)/game.js', views.gamejs, name='init'),
    url(r'^(?P<unique_id>\w+)/playerdata.js', views.playerdatajs, name='playerdata'),
    url(r'^submitfile/(?P<unique_id>\w+)/', views.process_upload, name='submitfile'),
    url(r'^uploadcontact/(?P<unique_id>\w+)/', views.process_contact, name='submitcontact'),
    url(r'^uploadmotivation/(?P<unique_id>\w+)/', views.process_motivation_letter, name='submitmotivation'),
    url(r'^uploadfilemotivation/(?P<unique_id>\w+)/', views.process_motivation_upload, name='submitmotivationfile'),
    url(r'^' + upload_url + '(?P<filename>[a-zA-Z\-0-9\.\_]+)', views.show_uploaded_file, name="file_show")
    #submit form
)
