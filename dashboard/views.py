from django.shortcuts import render, redirect
from django.contrib.auth import logout, authenticate
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import PasswordChangeForm, update_session_auth_hash
from django.contrib import messages
from django.http import HttpResponse
from django.views import View
from django.views.generic import TemplateView

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from users.forms import CustomUpdateUserForm, CustomUserCreationForm
from users.models import *
from django.db.models import Q

from django.contrib.auth import get_user_model
User = get_user_model()


class ProfileView(View):
    def get(self, request):
        profile = request.user
        return render(request, 'dashboard/profile.html', {"profile": profile})


@login_required(login_url='/dashboard/login/')
def menteedashboard(request):
    if request.user.user_type == "Mentor":
        return redirect('mentor:home')
    else:
        context = {}
        total_mentors = MentorMenteeRelations.objects.filter(
            mentee=request.user).count()
        total_sessions = MentorRequest.objects.filter(
            mentee=request.user, accepted=True).count()
        context['total_mentors'] = total_mentors
        context['total_sessions'] = total_sessions
        mentor_requests = MentorRequest.objects.filter(mentee=request.user)
        context['mentor_requests'] = mentor_requests

        return render(request, 'dashboard/index.html', context=context)


@login_required
def Logout(request):
    logout(request)
    print('the user is logged out')
    return redirect('/')


def menteelogin(request):
    context = {}
    context['title'] = 'Login'
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    if request.method == 'GET':
        global nxt
        nxt = request.GET.get('next')
    if request.method == 'POST':
        print(request.POST)
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(username, password)
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            messages.info(request, f"You are now logged in as {username}.")
            if request.user.user_type == 'Mentee':
                return redirect('dashboard:home')
            else:
                return redirect('mentor:home')
        else:
            messages.error(request, "Invalid username or password.")
    return render(request, 'dashboard/signin-sidebar.html')


def menteeregister(request):
    context = {}
    context['title'] = 'Create Account'

    if request.user.is_authenticated:
        messages.info(
            request, 'You have been already registered', context=context)
        return redirect('dashboard:home')
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        phone_number = request.POST.get('phone_number')
        address = request.POST.get('address')
        password = request.POST.get('password')

        print(password, 'password =============')
        user_created = User.objects.create_user(username=username, email=email, password=password, user_type="Mentee", first_name=first_name, last_name=last_name, phone_number=phone_number, address=address
                                                )

        user = authenticate(
            username=username, password=password)

        print(user)
        # auth_login(request, user)
        messages.success(request, 'Account succesfully created')
        return redirect('dashboard:menteelogin')
    return render(request, 'dashboard/signup-sidebar.html', {'mentee': False})


@login_required
def profile(request):
    context = {}
    context['user'] = request.user
    reviews = Review.objects.filter(user=request.user)
    context['reviews'] = reviews
    total_sessions = MentorRequest.objects.filter(
        mentee=request.user, accepted=True).count()
    total_mentees = MentorMenteeRelations.objects.filter(
        mentee=request.user).count()

    print(total_sessions)
    context['total_sessions'] = total_sessions
    context['profile'] = request.user
    context['total_mentees'] = total_mentees
    return render(request, 'dashboard/profile.html')


@login_required
def findamentor(request):
    context = {}
    mentors = MentorProfile.objects.all()
    context['mentors'] = mentors
    if request.method == 'POST':
        search_text = request.POST.get('search_text')
        print(search_text)
        mentors = MentorProfile.objects.filter(Q(user__first_name__icontains=search_text) | Q(
            user__last_name__icontains=search_text) | Q(user__email__icontains=search_text) | Q(user__username__icontains=search_text))
        context['mentors'] = mentors
        return render(request, 'dashboard/findamentor.html', context=context)
    return render(request, 'dashboard/findamentor.html', context=context)


@login_required
def mymentors(request):
    my_mentors = MentorMenteeRelations.objects.filter(mentee=request.user)
    context = {}
    context['my_mentors'] = my_mentors
    if request.method == 'POST':
        search_text = request.POST.get('search_text')
        print(search_text)
        my_mentors = MentorMenteeRelations.objects.filter(Q(mentor__first_name__icontains=search_text) | Q(
            mentor__last_name__icontains=search_text) | Q(mentor__email__icontains=search_text) | Q(mentor__username__icontains=search_text), mentee=request.user)
        context['my_mentors'] = my_mentors
        return render(request, 'dashboard/mymentors.html', context=context)
    return render(request, 'dashboard/mymentors.html', context=context)


@login_required
def joinmeeting(request):
    return render(request, 'dashboard/mentor-page.html')


@login_required
def mentorcontent(request):
    context = {}
    mentor_content = MentorRequest.objects.filter(mentee=request.user)
    context['mentor_content'] = mentor_content
    return render(request, 'dashboard/mentorcontent.html', context=context)


@login_required
def search(request):
    return render(request, 'dashboard/search.html')
