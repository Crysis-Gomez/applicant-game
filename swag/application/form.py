from django import forms


class UploadFileForm(forms.Form):

    title = forms.CharField(max_length=50, widget=forms.HiddenInput())
    file = forms.FileField()


class ContactInformation(forms.Form):

    name = forms.CharField(max_length=50)
    email = forms.EmailField(max_length=50)
