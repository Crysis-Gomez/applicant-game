from django.contrib import admin
from swag.application import models
from django.forms.models import BaseInlineFormSet
from django.utils.translation import ugettext_lazy as _


class GameFinishedFilter(admin.SimpleListFilter):
    title = _("finished")

    parameter_name = "game"
    test = None

    def lookups(self, request, model_admin):
        self.test = model_admin
        return (
            ('finished', 'Finished game'),
            ('unfinished', 'Unfinished game'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'finished':
            return queryset.filter(gameinstance__player_unlocked_boss=True)
        else:
            print queryset.filter(gameinstance__player_unlocked_boss=False)


class MyFormSet(BaseInlineFormSet):
    def get_queryset(self):
        if not hasattr(self, 'player_defeated_boss'):
            qs = super(MyFormSet, self).get_queryset().filter(player_unlocked_boss=True)
            self._queryset = qs
        return self._queryset


class Times(admin.TabularInline):
    model = models.Meeting
    extra = 1
    prepopulated_fields = {"dateID": ("pub_date", "pub_time")}


class Instance(admin.TabularInline):
    extra = 0
    model = models.GameInstance


class Answer(admin.TabularInline):
    extra = 0
    model = models.PlayerQuestion
    #formset = MyFormSet


class Skill(admin.TabularInline):
    model = models.PlayerSkill
    extra = 1


# class Quest(admin.TabularInline):
#     model = models.Question
#     extra = 0


class VacancyAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}

    def unfinished_games(self, obj):
        return str(len([x.name() for x in models.GameInstance.objects.filter(vacancy=obj, player_unlocked_boss=False)]))

    def finished_games(self, obj):
        return str(len([x.name() for x in models.GameInstance.objects.filter(vacancy=obj, player_unlocked_boss=True)]))

    def skill_set_list(self, obj):
        return str(",".join([x.title for x in obj.skill_sets.all()]))

    list_display = ('title', 'unfinished_games', 'finished_games', 'skill_set_list')
    list_filter = [GameFinishedFilter]
    inlines = [Instance, Times]


class CV(admin.TabularInline):
    model = models.CvDocument
    extra = 0


class Motivation(admin.TabularInline):
    model = models.MotivationLetter
    extra = 0


class Link(admin.TabularInline):
    model = models.PortfolioLink
    extra = 0


class PortfolioLinksAdmin(admin.ModelAdmin):
    list_display = ['get_link']


class GameInstanceAdmin(admin.ModelAdmin):
    list_filter = ['vacancy', 'player_unlocked_boss']
    list_display = ('name', 'has_cv', 'has_motivation', 'player_unlocked_boss', 'has_links', 'has_rated_skills')
    inlines = [CV, Motivation, Link, Skill, Answer]


class MeetingAdmin(admin.ModelAdmin):
    prepopulated_fields = {
        "dateID": ("pub_date", "pub_time")}

    def vacancy(self, obj):
        return obj.vacancy
    list_display = ('vacancy', 'dateID')


class PlayerSkillAdmin(admin.ModelAdmin):
    list_display = ('score', 'skill', 'game_instance')


admin.site.register(models.GameInstance, GameInstanceAdmin)
admin.site.register(models.CvDocument)
#admin.site.register(models.PlayerQuestion)
admin.site.register(models.Question)
admin.site.register(models.Vacancy, VacancyAdmin)
admin.site.register(models.MotivationLetter)
admin.site.register(models.Meeting, MeetingAdmin)
admin.site.register(models.PortfolioLink)
admin.site.register(models.SkillSet)
admin.site.register(models.PlayerQuestion)
admin.site.register(models.PlayerSkill, PlayerSkillAdmin)
