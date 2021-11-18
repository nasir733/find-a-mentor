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
from meeting.models import Meeting
from users.forms import CustomUpdateUserForm, CustomUserCreationForm, MenteeProfileUpdateForm
from users.models import *
from django.db.models import Q
from datetime import datetime
import pprint
import pandas as pd
import decimal
from django.core import serializers
from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.contrib.auth import get_user_model
from notifications.signals import notify
import re
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
        data = Catergory.objects.all()
        request.session['catergory'] = list(data.values())
        
        print(data)
        random_catergory = Catergory.objects.order_by('?')[0]
        print(random_catergory.name)
        interested_contents = Content.objects.order_by('?')[:3]
        context['interested_contents'] =interested_contents

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
        username=""
        print(request.POST)
        email = request.POST.get('email')
        password = request.POST.get('password')
        print(email, password)
        if User.objects.filter(email=email).exists():
            username = User.objects.get(email=email.lower()).username
        user = authenticate(request, username=username, password=password)
        print(user)
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
        
        password = request.POST.get('password')

        print(password, 'password =============')
        user_created = User.objects.create_user(username=username, email=email, password=password, user_type="Mentee"
                                                )

        user = authenticate(
            username=username, password=password)
        mentee_profile = MenteeProfile(user=user)
        mentee_profile.save()
        mentee_interest = MenteeInterest(mentee=mentee_profile)
        mentee_interest.save()
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
    context['skills'] = Skill.objects.all()
    
    return render(request, 'dashboard/profile.html', context=context)

def skills_json(request):
    context = {}
    tag = request.GET.get('tag')
    payload = []
    if tag:
        skills = Skill.objects.filter(name__icontains=tag)
        for skill in skills:
            payload.append(skill.name)

    return JsonResponse({'status': 200, 'data': payload})    

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
    context={}
    booked = Meeting.objects.filter(mentee=request.user.menteeprofile,completed=False)
    print(booked)
    context['booked'] = booked
    return render(request, 'dashboard/joinmeeting.html',context=context)


@login_required(login_url='/dashboard/login/')
def mentorcontent(request):
    context = {}
    pending = MentorRequest.objects.filter(Q(accepted=False)&Q(declined=False),mentee=request.user.menteeprofile)
    booked = MentorRequest.objects.filter(accepted=True,mentee=request.user.menteeprofile)
    declined = MentorRequest.objects.filter(declined=True,mentee=request.user.menteeprofile)
    context['pending'] = pending
    context['booked'] = booked
    context['declined'] = declined

    return render(request, 'dashboard/mentorcontent.html', context=context)


@login_required(login_url='/dashboard/login/')
def search(request):
    return render(request, 'dashboard/search.html')


@login_required(login_url='/dashboard/login/')
def browsecontent(request):
    context = {}
    contents = Content.objects.filter(is_active=True)
    catergory = Catergory.objects.all()
    context['catergory'] = catergory
    context['contents'] = contents
    if request.user.user_type == 'Mentor':
        return redirect('mentor:browse')
    else:
        return render(request, 'dashboard/browsecontent.html', context=context)

@login_required(login_url='/dashboard/login/')
def catergorycontent(request,category):
    context = {}
    
    contents = Content.objects.filter(content_tags__catergory__name__icontains=category).distinct()
    print(contents)
    context['contents'] = contents
    tags = Skill.objects.filter(catergory__name=category)[0:4]
    context['tags'] = tags
    print(context['tags'])
    if request.user.user_type == 'Mentor':
        return redirect('mentor:browse')
    else:
        return render(request, 'dashboard/browsecontent.html', context=context)

@login_required(login_url='/dashboard/login/')
def tagcontent(request,category,tag):
    context = {}
    print(tag)
    contents = Content.objects.filter(content_tags__name=tag).distinct()
    print(contents)
    tags = Skill.objects.filter(catergory__name=category)[0:4]
    context['tags'] = tags
    context['contents'] = contents
    if request.user.user_type == 'Mentor':
        return redirect('mentor:browse')
    else:
        return render(request, 'dashboard/browsecontent.html', context=context)

@login_required(login_url='/dashboard/login/')
def browsetags(request):
    context = {}
    tags = Skill.objects.all()
    context['tags'] = tags
    return render(request, 'dashboard/browsetags.html', context=context)
    
@login_required(login_url='/dashboard/login/')
def settings(request):
    context = {}
    menteeprofile = request.user.menteeprofile
    userform = CustomUpdateUserForm(instance=request.user)
    menteeform = MenteeProfileUpdateForm(instance=menteeprofile)
    context['userform'] = userform
    context['menteeform'] = menteeform
    if request.method =="POST" or request.method == "FILES":
        user = User.objects.get(id=request.user.id)
        username = request.POST.get('username')
        email = request.POST.get('email')
        phone_number = request.POST.get('phone_number')
        birth_date = (request.POST.get('birth_date'))
        print(birth_date)
        image = request.FILES.get('image')
        user.username = username
        user.email = email
        user.phone_number = phone_number
        # menteeprofile.birth_date = birth_date
        if image is None:
                print(" 2")
        else:
            menteeprofile.image = image
        menteeprofile.save()
        user.save()
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
        rating_number = request.POST.get('rating_number')
        print(int(rating_number))
        review = Review(content=content, user=request.user, message=message,rating=int(rating_number))
        review.save()
        url = "/mentor/content/{}".format(review.content.id)
        notify.send(review.user, recipient=content.user.user, verb='Review Added', description=review.message,url=url)
			
        messages.success(request, 'Review added successfully')
        return redirect('dashboard:content', id=content_id)


@login_required(login_url='/dashboard/login/')
@csrf_exempt
def  requestcontent(request, content_id):
    context={}
    content = Content.objects.get(id=content_id)
    #price_per_hour = content.price_per_hour
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
    context['mentor_availablity'] = mentor_availablity
    context['mentor_availablity_weekday'] = mentor_availablity_weekday
    
    if request.method == "POST":
        if request.user.user_type == "Mentee":
            date = request.POST.get('date')
            availablityid = request.POST.get('availablityid')
            
            mentor_selected_availablity = MentorAvailability.objects.get(id=int(availablityid))
            
            temp = pd.Timestamp(date)
            week = temp.day_name()
            mentee_request = MentorRequest(mentee=request.user.menteeprofile,mentor=mentor,content=content)
            mentee_request.save()
            mentor_request_time = MentorRequestTime(request=mentee_request,date=date,weekday=week,mentor_availibility=mentor_selected_availablity)
            mentor_request_time.save()
            url = "/mentor/acceptrequest/{}".format(mentee_request.id)
            message= "{} requested {} on {}".format(request.user.username,content.title,date)
            notify.send(request.user, recipient=mentor.user, verb='Content Requested', description=message,url=url)
			
            return JsonResponse({'status':'success'})
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
        availablity_mentor = list(mentor_availablity.values())
        
        return JsonResponse({"mentor_availablity":availablity_mentor,"week":week})
        


@login_required(login_url='/dashboard/login/')
def addfavouritetags(request):

    if request.method == "POST":
        if request.user.user_type == "Mentee":
            mentee_interests= MenteeInterest.objects.get(mentee=request.user.menteeprofile)
            tag = request.POST.get('tag_input').lower()
            if ',' in tag:
                tags = re.split('[,;|]', tag.lower())
                print(tags)
                for i in tags:
                    print(i)
                    if mentee_interests.interest.filter(name=i).exists():
                        print("tag already exists")
                    else:
                        
                        if Skill.objects.filter(name=i).exists():
                            skill = Skill.objects.filter(name=i)
                            for z in skill:
                                mentee_interests.interest.add(z)
                                mentee_interests.save()
                        else:    
                            print("tag not exists")       
                return redirect('dashboard:profile')
            else:
                print(tag)
                if mentee_interests.interest.filter(name=tag).exists():
                    print("tag already exists")
                    return redirect('dashboard:profile')
                else:
                    
                    if Skill.objects.filter(name=tag).exists():
                        skill = Skill.objects.filter(name=tag)
                        for i in skill:
                            mentee_interests.interest.add(i)
                            mentee_interests.save()
                    else:    
                        print("tag not exists")
                        return redirect('dashboard:profile')
                    
                    return redirect('dashboard:profile')
        elif request.user.user_type == "Mentor":

            mentor_skills= MentorSkill.objects.get(mentor=request.user.mentorprofile)
            tag = request.POST.get('tag_input').lower()
            if ',' in tag:
                tags = re.split('[,;|]', tag.lower())
                print(tags)
                for i in tags:
                    print(i)
                    if mentor_skills.skill.filter(name=i).exists():
                        print("tag already exists")
                    else:
                        
                        if Skill.objects.filter(name=i).exists():
                            skill = Skill.objects.filter(name=i)
                            for z in skill:
                                mentor_skills.skill.add(z)
                                mentor_skills.save()
                        else:    
                            print("tag not exists")       
                return redirect('mentor:profile')
            else:
                print(tag)
                if mentor_skills.skill.filter(name=tag).exists():
                    print("tag already exists")
                    return redirect('mentor:profile')
                else:
                    
                    if Skill.objects.filter(name=tag).exists():
                        skills = Skill.objects.filter(name=tag)
                        for i in skills:
                            mentor_skills.skill.add(i)
                            mentor_skills.save()
                    else:    
                        print("tag not exists")
                        return redirect('mentor:profile')
                    return redirect('mentor:profile')


@login_required(login_url='/dashboard/login/')
def completedsessions(request):
    context={}
    booked = Meeting.objects.filter(mentee=request.user.menteeprofile,completed=True)
    print(booked)
    context['booked'] = booked
    return render(request, 'dashboard/completedsessions.html',context=context)
