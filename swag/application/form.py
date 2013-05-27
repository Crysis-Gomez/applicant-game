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
        print 'These are the elements for our new form'
        print elements.all()

        super(SkillSetForm, self).__init__(*args, **kwargs)
        for el in elements.all():
            self.add_separate_fields(el)

    def add_separate_fields(self, field):

        CHOICES = [(i, i) for i in range(11)]
        name = field.title
        self.fields[name] = forms.TypedChoiceField(choices=CHOICES, initial='FIXED')


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
