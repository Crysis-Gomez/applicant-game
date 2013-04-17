from django.db import models
from database_storage import DatabaseStorage
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import Http404


class Vacancy(models.Model):
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=20)
    slug = models.SlugField(max_length=50, unique=True)

    def __unicode__(self):
        return str(self.title)

    class Meta:
        verbose_name_plural = "Vacancies"


class GameInstance(models.Model):
    uid = models.CharField(max_length=200)
    progress = models.IntegerField(default=0)
    player_position_y = models.IntegerField(default=0)
    player_position_y = models.IntegerField(default=0)
    player_name = models.CharField(max_length=50)
    player_email = models.CharField(max_length=100)
    vacancy = models.ForeignKey(Vacancy)

    def __unicode__(self):
        my_name = self.name()
        return my_name

    def name(self):
        if not self.player_name:
            return "{name} - {vacancy} - {id}".format(
                name="unknown player",
                vacancy=self.vacancy.title,
                id=self.uid)

        return self.player_name

    def has_cv(self):
        try:
            get_object_or_404(CvDocument, game_instance=self.id)
        except Http404:
            return False

        return True

    def has_motivation(self):
        try:
            get_object_or_404(MotivationLetter, game_instance=self.id)
        except Http404:
            return False

        return True


class CvDocument(models.Model):
    title = models.CharField(max_length=200)
    game_instance = models.ForeignKey(GameInstance)
    #motivation_letter = models.TextField()
    attachment = models.FileField(upload_to=settings.DBS_OPTIONS['base_url'], storage=DatabaseStorage(options=settings.DBS_OPTIONS))

    def __unicode__(self):
        return str(self.title)


class MotivationLetter(models.Model):

    title = models.CharField(max_length=50, editable=False)
    game_instance = models.ForeignKey(GameInstance, editable=False)
    entry = models.TextField(null=True, blank=True)
    attachment = models.FileField(upload_to=settings.DBS_OPTIONS['base_url'], storage=DatabaseStorage(options=settings.DBS_OPTIONS), null=True, blank=True)

    def __unicode__(self):
        return str(self.title)


