from django.contrib import admin
from application.models import Vacancy
from application.models import GameInstance
from application.models import CvDocument
from application.models import MotivationLetter


class VacancyAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}

admin.site.register(GameInstance)
admin.site.register(CvDocument)
admin.site.register(Vacancy, VacancyAdmin)
admin.site.register(MotivationLetter)
