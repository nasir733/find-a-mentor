from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.db.models import fields
from .models import *

class DateInput(forms.DateInput):
    input_type = 'date'
class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password')


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = '__all__'




class CustomUpdateUserForm(forms.ModelForm):

    class Meta:
        model = CustomUser
        fields = ['username','email','phone_number','address','country','city','timezone']


class MentorProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = MentorProfile
        fields = ['user','bio','birth_date','image','instagram_url','twitter_url','facebook_url',
        'linkedin_url','github_url','website_url','youtube_url']
        widgets = {
            'birth_date': DateInput()
        }

class MenteeProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = MenteeProfile
        fields = ['user','birth_date','image']
        widgets = {
            'birth_date': DateInput()
        }

class CreateContentForm(forms.ModelForm):
    class Meta:
        model = Content
        fields =['title','description','image','video_link']

