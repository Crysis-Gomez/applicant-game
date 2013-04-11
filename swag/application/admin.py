from django.contrib import admin
from application.models import Vacancy
from application.models import GameInstance
from application.models import ApplicationDocument


class VacancyAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}

admin.site.register(GameInstance)
admin.site.register(ApplicationDocument)
admin.site.register(Vacancy, VacancyAdmin)
