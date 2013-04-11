from django.db import models
from database_storage import DatabaseStorage
from django.conf import settings


class Vacancy(models.Model):
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=20)
    slug = models.SlugField(max_length=50, unique=True)

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Vacancies"


class GameInstance(models.Model):
    uid = models.CharField(max_length=200)
    progress = models.IntegerField(default=0)
    playerPositionX = models.IntegerField(default=0)
    playerPositionY = models.IntegerField(default=0)
    playerName = models.CharField(max_length=50)
    playerEmail = models.CharField(max_length=100)
    vacancy = models.ForeignKey(Vacancy)

    def __unicode__(self):
        my_name = "{title}-{id}".format(
            title=self.vacancy.title,
            id=self.uid
        )

        return my_name


class ApplicationDocument(models.Model):
    title = models.CharField(max_length=200)
    game_instance = models.ForeignKey(GameInstance)
    attachment = models.FileField(upload_to=settings.DBS_OPTIONS['base_url'], storage=DatabaseStorage(options=settings.DBS_OPTIONS))

    def __unicode__(self):
        return self.title
