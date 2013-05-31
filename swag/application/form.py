from django import forms
from django.db import models
from django.forms import Textarea
from django.forms import ModelForm
from application.models import MotivationLetter
from application.models import Meeting
from application.models import PortfolioLink
from application.models import SkillSet
from application.models import Vacancy
from application.models import PlayerSkill


class UploadFileForm(forms.Form):

    title = forms.CharField(max_length=50, widget=forms.HiddenInput())
    document = forms.FileField()


class ContactInformationForm(forms.Form):

    name = forms.CharField(max_length=50)
    email = forms.EmailField(max_length=50)


class PortfolioForm(ModelForm):
    class Meta:
        model = PortfolioLink
        widgets = {
            'content': Textarea(
                attrs={
                    'cols': 40,
                    'rows': 20}),
        }


class SkillSetForm(forms.Form):

    def __init__(self, *args, **kwargs):
        elements = kwargs.pop('elements')

        super(SkillSetForm, self).__init__(*args, **kwargs)
        for el in elements.all():
            self.add_separate_fields(el)

    def add_separate_fields(self, field):

        CHOICES = [(i, self.getName(i)) for i in range(10)]
        name = field.title
        self.fields[name] = forms.TypedChoiceField(choices=CHOICES, initial='FIXED')

    def getName(self, index):
        skillString = ""
        if(index == 9):
            skillString = "I wrote a book about it"
        elif(index == 8):
            skillString = "I can write a book about it"
        elif(index == 7):
            skillString = "I know almost every functions"
        elif(index == 6):
            skillString = "I can write complex components"
        elif(index == 5):
            skillString = "I can write basic components"
        elif(index == 4):
            skillString = "I can program classes  "
        elif(index == 3):
            skillString = "I can program little scripts"
        elif(index == 2):
            skillString = "Read a book about"
        elif(index == 1):
            skillString = "Have heard about"
        elif(index == 0):
            skillString = "Never heard about it"

        return skillString

class MeetingForm(forms.ModelForm):

    class Meta:
        model = Meeting


class LetterForm(ModelForm):

    class Meta:
        model = MotivationLetter
        widgets = {
            'content': Textarea(
                attrs={
                    'cols': 80,
                    'rows': 40}),
        }
