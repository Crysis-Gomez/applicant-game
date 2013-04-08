from django.db import models


class Vacancy(models.Model):
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=20)

    def __unicode__(self):
        return self.title


class GameInstance(models.Model):
    uid = models.CharField(max_length=200)
    progress = models.IntegerField(default=0)
    playerPositionX = models.IntegerField(default=0)
    playerPositionY = models.IntegerField(default=0)
    vacancy = models.ForeignKey(Vacancy)

    def __unicode__(self):
        my_name = "{title}-{id}".format(
            title=self.vacancy.title,
            id=self.uid
        )

        return my_name
