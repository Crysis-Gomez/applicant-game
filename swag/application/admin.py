from django.contrib import admin
from application.models import Vacancy
from application.models import GameInstance

admin.site.register(GameInstance)
admin.site.register(Vacancy)
