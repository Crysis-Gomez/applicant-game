from django.db import models
from database_storage import DatabaseStorage
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.core.exceptions import MultipleObjectsReturned
from django.http import Http404
from django.utils.html import format_html
import json
import datetime
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.utils.safestring import mark_safe


class SkillSet(models.Model):
    title = models.CharField(max_length=200)

    def __unicode__(self):
            return self.title


class Question(models.Model):
    title = models.CharField(max_length=200)
    question = models.TextField(null=True, blank=False)

    def __unicode__(self):
        return self.title

class Vacancy(models.Model):
    title = models.CharField(max_length=200)
    department = models.CharField(max_length=20)
    slug = models.SlugField(max_length=50, unique=True)
    job_description = models.TextField(max_length=500)
    job_description_output = models.TextField(max_length=500, editable=False)
    introduction_mail = models.TextField(max_length=500, help_text="fill in the introduction e-mail,which the user wil receive")
    finalization_mail = models.TextField(max_length=500, help_text="fill in the final e-mail,which the user wil receive")
    skill_sets = models.ManyToManyField(SkillSet, help_text="Select or create the skill, which you want to ask the player for his experience")
    question = models.ForeignKey(Question, null=True, blank=False, help_text="Select or create a brainteaser which the player answers")
    pub_date = models.DateTimeField(auto_now=True, auto_now_add=True)

    def save(self, *args, **kwargs):
        self.job_description_output = mark_safe(self.job_description.replace("\n", "<br/>"))
        super(Vacancy, self).save(*args, **kwargs)

    def was_published(self):
        return self.pub_date >= timezone.now()

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
    cv_building_unlocked = models.BooleanField(default=False)
    motivation_building_unlocked = models.BooleanField(default=False)
    skills_building_unlocked = models.BooleanField(default=False)
    links_building_unlocked = models.BooleanField(default=False)
    player_finished_intro = models.BooleanField(default=False)
    player_unlocked_boss = models.BooleanField(default=False)
    player_name = models.CharField(max_length=50, blank=True)
    player_email = models.EmailField(max_length=100, blank=True)
    cv_game_skipped = models.BooleanField(default=False)
    cv_game_time = models.TimeField('completed', blank=True, null=True)
    motivation_game_skipped = models.BooleanField(default=False)
    motivation_game_time = models.TimeField('completed', blank=True, null=True)
    skill_game_skipped = models.BooleanField(default=False)
    skill_game_time = models.TimeField('completed', blank=True, null=True)
    links_game_skipped = models.BooleanField(default=False)
    links_game_time = models.TimeField('completed', blank=True, null=True)

    vacancy = models.ForeignKey(Vacancy)

    def __unicode__(self):
        return self.name()

    def get_cv_time(self):
        return self.cv_game_time

    def get_motivation_time(self):
        return self.motivation_game_time

    def get_skill_time(self):
        return self.skill_game_time

    def get_links_time(self):
        return self.links_game_time


    def get_Intro(self):
        if self.player_finished_intro is True:
            return 1
        return 0

    def get_answer(self):
        try:
            get_object_or_404(PlayerQuestion, game_instance=self.id)
        except Http404:
            return False

        return True

    def get_contact(self):
        if self.player_name and self.player_email:
            return True
        else:
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

    def get_all_links(self):
        try:
            port = PortfolioLink.objects.filter(game_instance=self.id)
            links = [str(link) for link in port]
            return links
        except Http404:
            return False

    def get_skill_name(self, skill):
        return str(skill.skill.title)

    def get_skill_rating(self, skill):
        return int(skill.score)

    def get_all_skills(self):
        try:
            skills = PlayerSkill.objects.filter(game_instance=self.id)
            names = [(self.get_skill_name(skill), self.get_skill_rating(skill)) for skill in skills]
            return names
        except Http404:
            return False

    def get_all_scores(self):
        try:
            skills = PlayerSkill.objects.filter(game_instance=self.id)
            skill_ratings = [self.get_skill_rating(skill) for skill in skills]
            return skill_ratings
        except Http404:
            return False

    def get_cv_link(self):
        try:
            document = get_object_or_404(CvDocument, game_instance=self.id)
            return document.attachment
        except Http404:
            return False

    def get_motivation_link(self):
        try:
            motivation = get_object_or_404(MotivationLetter, game_instance=self.id)
            if motivation.attachment:
                return motivation.attachment
            return False
        except Http404:
            return False

    def get_motivation_entry(self):
        try:
            motivation = get_object_or_404(MotivationLetter, game_instance=self.id)
            if motivation.entry:
                return motivation.entry
        except Http404:
            return False

    def get_vacancy(self):
        return self.vacancy

    def has_motivation(self):
        try:
            get_object_or_404(MotivationLetter, game_instance=self.id)

        except Http404:
            return False

        return True
    has_motivation.boolean = True


class PlayerQuestion(models.Model):
    question = models.ForeignKey(Question)
    game_instance = models.ForeignKey(GameInstance)
    answer = models.TextField(null=True, blank=False)

    class Meta:
        unique_together = (("question", "game_instance"),)

    def __unicode__(self):
        return self.question.title


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

    def clean(self):
        if not self.attachment and not self.entry:
            raise ValidationError('You need to fill at least one field')

    def __unicode__(self):
        return str(self.title)


class Applicationdocumentfiles(models.Model):
    filename = models.CharField(max_length=255, primary_key=True)
    data = models.CharField(max_length=200)
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
