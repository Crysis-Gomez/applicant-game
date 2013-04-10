from django.contrib import admin
from application.models import Vacancy
from application.models import GameInstance


class VacancyAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}

admin.site.register(GameInstance)
admin.site.register(Vacancy, VacancyAdmin)
