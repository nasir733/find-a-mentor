from django.shortcuts import render, redirect
from django.contrib.auth import logout, authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import PasswordChangeForm, update_session_auth_hash
from django.contrib import messages
from django.http import HttpResponse
from django.views import View
from django.views.generic import TemplateView
from django.db.models import Q

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from users.forms import CustomUpdateUserForm
# Create your views here.
from django.contrib.auth.decorators import login_required


from django.contrib.auth import get_user_model

from users.models import *
User = get_user_model()


@login_required(login_url='/mentor/login/')
def home(request):
    if request.user.user_type == 'Mentee':
        return redirect('dashboard:home')
    context = {}
    total_sessions = MentorRequest.objects.filter(
        mentor=request.user, accepted=True).count()
    total_mentees = MentorMenteeRelations.objects.filter(
        mentor=request.user).count()

    print(total_sessions)
    context['total_sessions'] = total_sessions
    context['profile'] = request.user
    context['total_mentees'] = total_mentees

    mentor_requests = MentorRequest.objects.filter(mentor=request.user)
    context['mentor_requests'] = mentor_requests

    return render(request, 'mentor/index.html', context=context)


def login(request):
    context = {}
    context['title'] = 'Login'
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('mentor:home')
    if request.method == 'GET':
        global nxt
        nxt = request.GET.get('next')
    if request.method == 'POST':
        print(request.POST)
        username = request.POST.get('email')
        password = request.POST.get('password')
        print(username, password)
        user = authenticate(request, username=username, password=password)
        print(user)
        if user is not None:
            auth_login(request, user)
            messages.success(request, 'You are logged in ')
            print('the use is logged in ')
            if request.user.user_type == 'Mentee':
                return redirect('dashboard:home')
            else:
                return redirect('mentor:home')
        else:
            print('the user is not logged in')
            messages.error(request, 'Username or maybe Password is incorrect')
    return render(request, 'dashboard/mentor-signin-sidebar.html')


def mentorregister(request):
    context = {}
    context['title'] = 'Create Account'
    if request.user.is_authenticated:
        messages.info(
            request, 'You have been already registered')
        return redirect('mentor:home')
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        phone_number = request.POST.get('phone_number')
        address = request.POST.get('address')
        password = request.POST.get('password')

        print(password, 'password =============')
        user_created = User.objects.create_user(username=username, email=email, password=password, user_type="Mentor", first_name=first_name, last_name=last_name, phone_number=phone_number, address=address
                                                )

        user = authenticate(
            username=username, password=password)

        print(user)
        # auth_login(request, user)
        messages.success(request, 'Account succesfully created')
        return redirect('mentor:login')
    return render(request, 'dashboard/mentor-signup-sidebar.html')


@login_required
def profile(request):
    context = {}
    context['user'] = request.user
    reviews = Review.objects.filter(content__user=request.user)
    context['reviews'] = reviews
    total_sessions = MentorRequest.objects.filter(
        mentor=request.user, accepted=True).count()
    total_mentees = MentorMenteeRelations.objects.filter(
        mentor=request.user).count()

    print(total_sessions)
    context['total_sessions'] = total_sessions
    context['profile'] = request.user
    context['total_mentees'] = total_mentees
    return render(request, 'mentor/myprofile.html', context=context)


@login_required
def clippedcontent(request):
    return render(request, 'mentor/clippedcontent.html')


@login_required
def mymentees(request):
    my_mentees = MentorMenteeRelations.objects.filter(mentor=request.user)
    context = {}
    context['my_mentees'] = my_mentees
    if request.method == 'POST':
        search_text = request.POST.get('search_text')
        print(search_text)
        my_mentees = MentorMenteeRelations.objects.filter(Q(mentee__first_name__icontains=search_text) | Q(
            mentee__last_name__icontains=search_text) | Q(mentee__email__icontains=search_text) | Q(mentee__username__icontains=search_text), mentor=request.user)
        context['my_mentees'] = my_mentees
        return render(request, 'mentor/mymentees.html', context=context)
    return render(request, 'mentor/mymentees.html', context=context)


@login_required
def startmeeting(request):
    return render(request, 'mentor/mentor-page.html')


@login_required
def mycontent(request):
    my_contents = Content.objects.filter(user=request.user)
    context = {}
    context['my_contents'] = my_contents
    if request.method == 'POST':
        search_text = request.POST.get('search_text')
        print(search_text)
        my_mentees = Content.objects.filter(
            Q(title__icontains=search_text), user=request.user)
        print(my_mentees)
        context['my_mentees'] = my_mentees
        return render(request, 'mentor/mycontent.html', context=context)
    return render(request, 'mentor/mycontent.html', context=context)


@login_required
def search(request):
    return render(request, 'mentor/search.html')


@login_required
def mentorpage(request):
    context = {}
    profile = MentorProfile.objects.get(user=request.user)
    context['profile'] = profile
    mentor_skills = MentorSkill.objects.filter(mentor=request.user)
    context['mentor_skills'] = mentor_skills
    return render(request, 'mentor/mentor-page.html', context=context)
