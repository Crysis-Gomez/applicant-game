from django.contrib import admin
from application.models import Vacancy
from application.models import GameInstance
from application.models import CvDocument
from application.models import MotivationLetter


class VacancyAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}


class GameInstanceAdmin(admin.ModelAdmin):
    list_display = ('name', 'vacancy', 'has_cv', 'has_motivation')
    # self.has_cv.short_description = "Uploaded cv"

admin.site.register(GameInstance, GameInstanceAdmin)
admin.site.register(CvDocument)
admin.site.register(Vacancy, VacancyAdmin)
admin.site.register(MotivationLetter)
