from django.db import models
from database_storage import DatabaseStorage
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.core.exceptions import MultipleObjectsReturned
from django.http import Http404
from django.utils.html import format_html


class SkillSet(models.Model):
    title = models.CharField(max_length=200)

    def __unicode__(self):
            return self.title


class Vacancy(models.Model):
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=20)
    slug = models.SlugField(max_length=50, unique=True)
    mail_text = models.CharField(max_length=500)
    skill_sets = models.ManyToManyField(SkillSet)

    def __unicode__(self):
        return str(self.title)

    def active_games(self, finished=True):
        return len([x for i, x in enumerate(GameInstance.objects.filter(vacancy=self))])

    class Meta:
        verbose_name_plural = "Vacancies"


class GameInstance(models.Model):
    uid = models.CharField(max_length=200)
    progress = models.IntegerField(default=0)
    player_position_y = models.IntegerField(default=5)
    player_position_x = models.IntegerField(default=5)
    player_cv_unlockedQuest = models.BooleanField(default=False)
    player_motivation_uplockedQuest = models.BooleanField(default=False)
    player_link_unlockedQuest = models.BooleanField(default=False)
    player_skill_unlockedQuest = models.BooleanField(default=False)
    player_defeated_boss = models.BooleanField(default=False)
    player_name = models.CharField(max_length=50)
    player_email = models.EmailField(max_length=100)

    vacancy = models.ForeignKey(Vacancy)

    def __unicode__(self):
        return self.name()

    def has_skills():
        return False

    def name(self):
        if not self.player_name:
            return "{name} - {vacancy} - {id}".format(
                name="unknown player",
                vacancy=self.vacancy.title,
                id=self.uid)

        return self.player_name

    def has_links(self):
        if len(PortfolioLink.objects.filter(game_instance=self.id)) > 0:
            return True
        return False
    has_links.boolean = True

    def has_rated_skills(self):
        if len(PlayerSkill.objects.filter(game_instance=self.id)) > 0:
            return True
        return False

    has_rated_skills.boolean = True

    def has_cv(self):
        try:
            get_object_or_404(CvDocument, game_instance=self.id)
        except Http404:
            return False

        return True
    has_cv.boolean = True

    def has_motivation(self):
        try:
            get_object_or_404(MotivationLetter, game_instance=self.id)
        except Http404:
            return False

        return True
    has_motivation.boolean = True


class PlayerSkill(models.Model):
    id = models.AutoField(primary_key=True)
    skill = models.ForeignKey(SkillSet)
    game_instance = models.ForeignKey(GameInstance)

    score = models.IntegerField(default=0)

    class Meta:
        unique_together = (("skill", "game_instance"),)


class Meeting(models.Model):
    player_name = models.CharField(max_length=50, default="unknown")
    pub_date = models.DateField()
    pub_time = models.TimeField()
    vacancy = models.ForeignKey(Vacancy)
    dateID = models.SlugField(max_length=50, unique=True)

    def __unicode__(self):
        return str(self.pub_date)


class GameData(models.Model):
    game_instance = models.ForeignKey(GameInstance)
    position_x = models.IntegerField(default=5)
    position_y = models.IntegerField(default=5)
    cv_unlocked = models.BooleanField(default=False)
    motivation_unlocked = models.BooleanField(default=False)


class PortfolioLink(models.Model):
    links = models.URLField(max_length=200)
    #entry = models.TextField(null=True, blank=True)
    game_instance = models.ForeignKey(GameInstance, editable=False)

    def get_link(self):
        return self.links
    get_link.allow_tags = True

    def __unicode__(self):
        return self.links


class CvDocument(models.Model):
    title = models.CharField(max_length=200)
    game_instance = models.ForeignKey(GameInstance)
    attachment = models.FileField(
        upload_to=settings.DBS_OPTIONS['base_url'],
        storage=DatabaseStorage(options=settings.DBS_OPTIONS))

    def __unicode__(self):
        return str(self.title)


class MotivationLetter(models.Model):

    title = models.CharField(max_length=50, editable=False)
    game_instance = models.ForeignKey(GameInstance, editable=False)
    entry = models.TextField(null=True, blank=True)
    attachment = models.FileField(
        upload_to=settings.DBS_OPTIONS['base_url'],
        storage=DatabaseStorage(
            options=settings.DBS_OPTIONS),
        null=True,
        blank=True)

    def __unicode__(self):
        return str(self.title)


class Applicationdocumentfiles(models.Model):
    filename = models.CharField(max_length=255, primary_key=True)
    data = models.TextField()
    size = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ApplicationDocumentFiles'


# class ApplicationCvdocument(models.Model):
#     id = models.IntegerField(primary_key=True)
#     title = models.CharField(max_length=200L)
#     game_instance = models.ForeignKey('ApplicationGameinstance')
#     attachment = models.CharField(max_length=100L)

#     class Meta:
#         managed = False
#         db_table = 'application_cvdocument'
