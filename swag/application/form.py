from django import forms
from django.forms import Textarea
from django.forms import ModelForm
from application.models import MotivationLetter
from application.models import Meeting
from application.models import PortfolioLinks


class UploadFileForm(forms.Form):

    title = forms.CharField(max_length=50, widget=forms.HiddenInput())
    document = forms.FileField()


class ContactInformationForm(forms.Form):

    name = forms.CharField(max_length=50)
    email = forms.CharField(max_length=50)


class PortfolioForm(ModelForm):
    class Meta:
        model = PortfolioLinks
        widgets = {
            'content': Textarea(
                attrs={
                    'cols': 80,
                    'rows': 40}),
        }


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
