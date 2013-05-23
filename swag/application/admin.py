from django.contrib import admin
from application.models import Vacancy
from application.models import GameInstance
from application.models import CvDocument
from application.models import MotivationLetter
from application.models import PortfolioLinks
from application.models import Meeting
from django.forms.models import BaseInlineFormSet
from django.utils.translation import ugettext_lazy as _
from application.models import SkillSet


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
            return queryset.filter(gameinstance__player_defeated_boss=True)
        else:
            print queryset.filter(gameinstance__player_defeated_boss=False)


class MyFormSet(BaseInlineFormSet):
    def get_queryset(self):
        if not hasattr(self, 'player_defeated_boss'):
            qs = super(MyFormSet, self).get_queryset().filter(player_defeated_boss=True)
            self._queryset = qs
        return self._queryset


class Times(admin.TabularInline):
    model = Meeting
    extra = 1
    prepopulated_fields = {"dateID": ("pub_date", "pub_time")}


class Instance(admin.TabularInline):
    extra = 0
    model = GameInstance
    #formset = MyFormSet


class Skills(admin.TabularInline):
    model = SkillSet
    extra = 1


class VacancyAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}

    def unfinished_games(self, obj):
        return str(len([x.name() for x in GameInstance.objects.filter(vacancy=obj, player_defeated_boss=False)]))

    def finished_games(self, obj):
        return str(len([x.name() for x in GameInstance.objects.filter(vacancy=obj, player_defeated_boss=True)]))


    def skill_set_list(self,obj):
        return str(",".join([x.title for x in obj.skill_sets.all()]))

    list_display = ('title', 'unfinished_games', 'finished_games','skill_set_list')
    list_filter = [GameFinishedFilter]
    inlines = [Instance, Times]


class CV(admin.TabularInline):
    model = CvDocument
    extra = 0


class Motivation(admin.TabularInline):
    model = MotivationLetter
    extra = 0


class Links(admin.TabularInline):
    model = PortfolioLinks
    extra = 0


class PortfolioLinksAdmin(admin.ModelAdmin):
    list_display = ['get_link']


class GameInstanceAdmin(admin.ModelAdmin):
    list_filter = ['vacancy', 'player_defeated_boss']
    list_display = ('name', 'has_cv', 'has_motivation', 'player_defeated_boss', 'has_links')
    inlines = [CV, Motivation, Links]


class MeetingAdmin(admin.ModelAdmin):
    prepopulated_fields = {
        "dateID": ("pub_date", "pub_time")}

    def vacancy(self, obj):
        return obj.vacancy
    list_display = ('vacancy', 'dateID')

admin.site.register(GameInstance, GameInstanceAdmin)
admin.site.register(CvDocument)
admin.site.register(Vacancy, VacancyAdmin)
admin.site.register(MotivationLetter)
admin.site.register(Meeting, MeetingAdmin)
admin.site.register(PortfolioLinks)
admin.site.register(SkillSet)