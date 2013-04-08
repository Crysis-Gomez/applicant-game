from django.conf.urls import patterns, url
# from django.views.generic import DetailView, ListView
from application import views

# from polls.models import Poll
# from django.utils import timezone

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^start_game/(?P<vacancy_id>\d+)/$', views.start_game, name='game'),
    url(r'^(?P<unique_id>\w+)/$', views.play, name='play'),
)