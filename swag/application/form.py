from django import forms
from django.forms import Textarea
from django.forms import ModelForm
from application.models import MotivationLetter


class UploadFileForm(forms.Form):

    title = forms.CharField(max_length=50, widget=forms.HiddenInput())
    document = forms.FileField()


class ContactInformationForm(forms.Form):

    name = forms.CharField(max_length=50)
    email = forms.CharField(max_length=50)


class LetterForm(ModelForm):

    class Meta:
        model = MotivationLetter
        widgets = {
            'content': Textarea(
                attrs={
                    'cols': 80,
                    'rows': 40}),
        }
