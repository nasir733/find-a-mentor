from django.http.response import JsonResponse
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
from users.forms import CustomUpdateUserForm, CustomUserCreationForm, MenteeProfileUpdateForm
from users.models import *
from django.db.models import Q
from datetime import datetime
import pandas as pd

from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.contrib.auth import get_user_model
User = get_user_model()





@login_required(login_url='/dashboard/login/')
def menteedashboard(request):
    if request.user.user_type == "Mentor":
        return redirect('mentor:home')
    else:
        context = {}
        total_mentors = MentorMenteeRelations.objects.filter(
            mentee=request.user.menteeprofile).count()
        total_sessions = MentorRequest.objects.filter(
            mentee=request.user.menteeprofile, accepted=True).count()
        context['total_mentors'] = total_mentors
        context['total_sessions'] = total_sessions


        mentor_requests = MentorRequest.objects.filter(mentee=request.user.menteeprofile)
        context['mentor_requests'] = mentor_requests

        return render(request, 'dashboard/index.html', context=context)


@login_required(login_url='/dashboard/login/')
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
        mentee_profile = MenteeProfile(user=user)
        mentee_profile.save()
        login(request, user)
        print(user)
        # auth_login(request, user)
        messages.success(request, 'Account succesfully created')
        return redirect('dashboard:menteelogin')
    return render(request, 'dashboard/signup-sidebar.html', {'mentee': False})


@login_required(login_url='/dashboard/login/')
def profile(request):
    context = {}
    context['user'] = request.user
    reviews = Review.objects.filter(user=request.user)
    context['reviews'] = reviews
    total_sessions = MentorRequest.objects.filter(
        mentee=request.user.menteeprofile, accepted=True).count()
    total_mentees = MentorMenteeRelations.objects.filter(
        mentee=request.user.menteeprofile).count()

    print(total_sessions)
    context['total_sessions'] = total_sessions
    context['profile'] = request.user
    context['total_mentees'] = total_mentees
    return render(request, 'dashboard/profile.html')


@login_required(login_url='/dashboard/login/')
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


@login_required(login_url='/dashboard/login/')
def mymentors(request):
    my_mentors = MentorMenteeRelations.objects.filter(mentee=request.user.menteeprofile)
    context = {}
    context['my_mentors'] = my_mentors
    return render(request, 'dashboard/mymentors.html', context=context)


@login_required(login_url='/dashboard/login/')
def joinmeeting(request):
    return render(request, 'dashboard/mentor-page.html')


@login_required(login_url='/dashboard/login/')
def mentorcontent(request):
    context = {}
    mentor_content = MentorRequest.objects.filter(mentee=request.user.menteeprofile)
    context['mentor_content'] = mentor_content
    return render(request, 'dashboard/mentorcontent.html', context=context)


@login_required(login_url='/dashboard/login/')
def search(request):
    return render(request, 'dashboard/search.html')


@login_required(login_url='/dashboard/login/')
def browsecontent(request):
    context = {}
    contents = Content.objects.filter(is_active=True)
    context['contents'] = contents
    if request.user.user_type == 'Mentor':
        return redirect('mentor:browse')
    else:
        return render(request, 'dashboard/browsecontent.html', context=context)


@login_required(login_url='/dashboard/login/')
def settings(request):
    context = {}
    menteeprofile = request.user.menteeprofile
    userform = CustomUpdateUserForm(instance=request.user)
    menteeform = MenteeProfileUpdateForm(instance=menteeprofile)
    context['userform'] = userform
    context['menteeform'] = menteeform
    if request.method =="POST":
        userform = CustomUpdateUserForm(request.POST, instance=request.user)
        menteeform = MenteeProfileUpdateForm(request.POST, request.FILES, instance=request.user.menteeprofile)
        if userform.is_valid() and menteeform.is_valid():
            userform.save()
            menteeform.save()
            messages.success(request, 'Profile updated successfully')
            return redirect('dashboard:settings')
        else:
            messages.error(request, 'Profile update failed')
            return redirect('dashboard:settings')
    return render(request, 'dashboard/settings.html', context=context)


@login_required(login_url='/dashboard/login/')
def singlecontent(request, id):
    context = {}
    content = Content.objects.get(id=id)
    context['content'] = content
    reviews = Review.objects.filter(content=content)
    context['reviews'] = reviews
    if request.user.user_type == "Mentee":
        if MentorRequest.objects.filter(mentee=request.user.menteeprofile, content=content).exists():
            menterrequest = MentorRequest.objects.filter(mentee=request.user.menteeprofile, content=content).first()

            context['mentor_request'] = menterrequest
        return render(request, 'dashboard/single-content.html', context=context)
    else:
        return redirect('mentor:content',id=id)
    

@login_required(login_url='/dashboard/login/')
def addreview(request, content_id):
    
    content = Content.objects.get(id=content_id)
    if request.method == "POST":
        message = request.POST.get('message')
        review = Review(content=content, user=request.user, message=message)
        review.save()
        messages.success(request, 'Review added successfully')
        return redirect('dashboard:content', id=content_id)


@login_required(login_url='/dashboard/login/')
@csrf_exempt
def requestcontent(request, content_id):
    context={}
    content = Content.objects.get(id=content_id)
    price_per_hour = content.price_per_hour
    mentor = content.user
    date=[]
    mentor_request_time = MentorRequestTime.objects.filter(Q(request__mentor=mentor)&Q(request__accepted=True))
    for i in mentor_request_time:
        date.append(i.date)
    mentor_availablity = MentorAvailability.objects.filter(mentor=mentor)
    mentor_availablity_weekday = []

    for i in mentor_availablity:
        if not(i.weekday == 'Monday'):
            week_id=1
        elif not(i.weekday == 'Tuesday'):
            week_id=2
        elif not(i.weekday == 'Wednesday'):
            week_id=3
        elif not(i.weekday == 'Thursday'):
            week_id=4
        elif not(i.weekday == 'Friday'):
            week_id=5
        elif not(i.weekday == 'Saturday'):
            week_id=6
        elif not(i.weekday == 'Sunday'):
            week_id=0
        mentor_availablity_weekday.append(week_id)
  
    context['mentor_availablity_weekday'] = mentor_availablity_weekday
    
    if request.method == "POST":
        if request.user.user_type == "Mentee":
            date = request.POST.get('date')
            from_hour = request.POST.get('from_hour')
            to_hour = request.POST.get('to_hour')
           
            temp = pd.Timestamp(date)
            week = temp.day_name()
            print(request.POST.get('mentor_id'))
            first_time = datetime.strptime(from_hour, '%H:%M')
            second_time = datetime.strptime(to_hour, '%H:%M')
            total_time = second_time - first_time
            total_amount = price_per_hour * total_time.seconds/3600
            print(total_amount)
            print(date)
            print(to_hour)
            print(from_hour)
            # print(first_time)
            # print(second_time)
            print(total_time)
            mentee_request = MentorRequest(mentee=request.user.menteeprofile,mentor=mentor,total_amount=total_amount,content=content)
            mentee_request.save()
            mentor_request_time = MentorRequestTime(request=mentee_request,date=date,from_hour=from_hour,to_hour=to_hour,weekday=week)
            mentor_request_time.save()
            return redirect('dashboard:content', id=content_id)
            # return redirect('dashboard:content', id=content_id)
    elif request.method == "GET":
            context['content'] = content
            return render(request, 'dashboard/requestcontent.html', context=context)
    else:
        return redirect('/')


@login_required(login_url='/dashboard/login/')
@csrf_exempt
def checkworkhours(request, content_id):
   print("ok")
   content = Content.objects.get(id=content_id)
   mentor = content.user
   if request.method == "POST":
        weekday = request.POST.get('weekday')
        print(request.POST.get('weekday'))
        weekday = int(weekday)
        if weekday == 1:
            week="Monday"
        elif weekday == 2:
            week="Tuesday"
        elif weekday == 3:
            week="Wednesday"
        elif weekday == 4:
            week="Thursday"
        elif weekday == 5:
            week="Friday"
        elif weekday == 6:
            week="Saturday"
        elif weekday == 0:
            week="Sunday"
        mentor_availablity = MentorAvailability.objects.filter(mentor=mentor, weekday=week)
        return JsonResponse({"mentor_availablity":list(mentor_availablity.values()),"week":week})
        
        