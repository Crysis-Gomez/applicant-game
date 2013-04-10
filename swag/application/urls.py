from django.conf.urls import patterns, url
# from django.views.generic import DetailView, ListView
from application import views

# from polls.models import Poll
# from django.utils import timezone

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^start_game/(?P<slug>[a-zA-Z\-0-9]+)/$', 'application.views.start_game', name='game'),
    url(r'^game/(?P<unique_id>\w+)/$', views.play, name='play'),
    url(r'^(?P<unique_id>\w+)/game.js', views.gamejs, name='init'),
    url(r'^submitfile/(?P<unique_id>\w+)/', views.process_upload, name='submitfile'),
    #submit form
)