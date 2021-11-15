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
from users.forms import  CreateContentForm, CustomUpdateUserForm, MentorProfileUpdateForm
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
        mentor=request.user.mentorprofile, accepted=True).count()
    total_mentees = MentorMenteeRelations.objects.filter(
        mentor=request.user.mentorprofile).count()

    print(total_sessions)
    context['total_sessions'] = total_sessions
    context['profile'] = request.user
    context['total_mentees'] = total_mentees
    data = Catergory.objects.all()
    request.session['catergory'] = list(data.values())
    mentor_requests = MentorRequest.objects.filter(mentor=request.user.mentorprofile)
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
       
        password = request.POST.get('password')

        print(password, 'password =============')
        user_created = User.objects.create_user(username=username, email=email, password=password, user_type="Mentor"
                                                )

        user = authenticate(
            username=username, password=password)

        # create mentor profile  
        prof = MentorProfile(user=user)
        prof.save()
        mentor_skill = MentorSkill(mentor=prof)
        mentor_skill.save()
        auth_login(request, user)
        messages.success(request, 'Account succesfully created')
        return redirect('mentor:login')
    return render(request, 'dashboard/mentor-signup-sidebar.html')


@login_required(login_url='/mentor/login/')
def profile(request):
    context = {}
    context['user'] = request.user
    reviews = Review.objects.filter(content__user=request.user.mentorprofile)
    context['reviews'] = reviews
    total_sessions = MentorRequest.objects.filter(
        mentor=request.user.mentorprofile, accepted=True).count()
    total_mentees = MentorMenteeRelations.objects.filter(
        mentor=request.user.mentorprofile).count()

    print(total_sessions)
    context['total_sessions'] = total_sessions
    context['profile'] = request.user
    context['total_mentees'] = total_mentees
    return render(request, 'mentor/myprofile.html', context=context)


@login_required(login_url='/mentor/login/')
def clippedcontent(request):
    return render(request, 'mentor/clippedcontent.html')


@login_required(login_url='/mentor/login/')
def mymentees(request):
    my_mentees = MentorMenteeRelations.objects.filter(mentor=request.user.mentorprofile)
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


@login_required(login_url='/mentor/login/')
def startmeeting(request):
    return render(request, 'mentor/mentor-page.html')


@login_required(login_url='/mentor/login/')
def mycontent(request):
    my_contents = Content.objects.filter(user=request.user.mentorprofile)
    context = {}
    context['my_contents'] = my_contents
    if request.method == 'POST':
        search_text = request.POST.get('search_text')
        print(search_text)
        my_mentees = Content.objects.filter(
            Q(title__icontains=search_text), user=request.user.mentorprofile)
        print(my_mentees)
        context['my_mentees'] = my_mentees
        return render(request, 'mentor/mycontent.html', context=context)
    return render(request, 'mentor/mycontent.html', context=context)


@login_required(login_url='/mentor/login/')
def search(request):
    return render(request, 'mentor/search.html')


@login_required(login_url='/mentor/login/')
def mentorpage(request,task="view"):
    context = {}
    profile = MentorProfile.objects.get(user=request.user)
    context['profile'] = profile
    catergories = Catergory.objects.all()
    context['catergories'] = catergories
    if MentorAvailability.objects.filter(mentor=request.user.mentorprofile).exists():
        mentor_working_hours = MentorAvailability.objects.filter(mentor=request.user.mentorprofile)
        context['mentor_working_hours'] = mentor_working_hours
    else:
        context['mentor_working_hours'] = None
    if task == "create":
        context['create'] = True
        context['skills'] = Skill.objects.all()
        if request.method == 'POST' or request.method == 'FILES':
            title = request.POST.get('title')
            description = request.POST.get('description')
            image = request.FILES.get('image')
            
            
            
            content = Content(title=title, description=description, image=image,
                                user=request.user.mentorprofile)
    
            content.save()
            
            return redirect('mentor:content',id=content.id)
            
        return render(request, 'mentor/mentor-page.html', context=context)
    else:
        context['create'] = False
        return render(request, 'mentor/mentor-page.html', context=context)


@login_required(login_url='/mentor/login/')
def settings(request):
    context = {}
    profile = request.user.mentorprofile
    userform = CustomUpdateUserForm(instance=request.user)
    menteeform = MentorProfileUpdateForm(instance=profile)
    context['userform'] = userform
    context['menteeform'] = menteeform
    if request.method =="POST":
        userform = CustomUpdateUserForm(request.POST, instance=request.user)
        menteeform = MentorProfileUpdateForm(request.POST, request.FILES, instance=profile)
        if userform.is_valid() and menteeform.is_valid():
            userform.save()
            menteeform.save()
            messages.success(request, 'Profile updated successfully')
            return redirect('mentor:settings')
        else:
            messages.error(request, 'Profile update failed')
            return redirect('mentor:settings')
    return render(request, 'mentor/settings.html', context=context)


@login_required(login_url='/mentor/login/')
def browsecontent(request):
    context = {}
    contents = Content.objects.filter(is_active=True)
    context['contents'] = contents
    catergory = Catergory.objects.all()[0:4]
    context['catergory'] = catergory
    if request.user.user_type == 'Mentor':
        return render(request, 'mentor/browsecontent.html', context=context)
    else:
        return redirect('dashboard:browse')


@login_required(login_url='/mentor/login/')
def catergorycontent(request,category):
    context = {}
    
    contents = Content.objects.filter(content_tags__catergory__name__icontains=category).distinct()
    print(contents)
    context['contents'] = contents
    tags = Skill.objects.filter(catergory__name=category)[0:4]
    context['tags'] = tags
    print(context['tags'])
    if request.user.user_type == 'Mentee':
        return redirect('dashboard:browse')
    else:
        return render(request, 'mentor/browsecontent.html', context=context)

@login_required(login_url='/mentor/login/')
def tagcontent(request,category,tag):
    context = {}
    print(tag)
    contents = Content.objects.filter(content_tags__name=tag).distinct()
    print(contents)
    tags = Skill.objects.filter(catergory__name=category)[0:4]
    context['tags'] = tags
    context['contents'] = contents
    if request.user.user_type == 'Mentee':
        return redirect('dashboard:browse')
    else:
        return render(request, 'mentor/browsecontent.html', context=context)

@login_required(login_url='/mentor/login/')
def browsetags(request):
    context = {}
    tags = Skill.objects.all()
    context['tags'] = tags
    return render(request, 'mentor/browsetags.html', context=context)

@login_required(login_url='/mentor/login/')
def singlecontent(request, id):
    context = {}
    catergories = Catergory.objects.all()
    context['catergories'] = catergories
    content = Content.objects.get(id=id)
    context['content'] = content
    reviews = Review.objects.filter(content=content)
    context['reviews'] = reviews
    course_catergory = CourseCatergory.objects.filter(content=content)
    context['tags'] = course_catergory
    if content.user == request.user.mentorprofile:
        booked = MentorRequest.objects.filter(content=content,accepted=True).count()
        pending = MentorRequest.objects.filter(Q(accepted=False)&Q(declined=False),content=content).count()
        declined = MentorRequest.objects.filter(declined=True,content=content).count()
        if request.user.user_type == "Mentor":

            context['booked'] = booked
            context['pending'] = pending
            context['declined'] = declined
            print(booked)
            print(pending)
            print(declined)
            
            return render(request, 'mentor/single-content.html', context=context)
        else:
            return redirect('dashboard:content',id=id)
    else:
        return render(request, 'mentor/other-single-content.html', context=context)
@login_required(login_url='/mentor/login/')
def singlecontentupdate(request, id):
    context = {}
    content = Content.objects.get(id=id)
    context['content'] = content
    if request.user.user_type == "Mentor":
        context['form'] = CreateContentForm(instance=request.user.mentorprofile)
        if request.method == 'POST' or request.method == 'FILES':
            title = request.POST.get('title')
            description = request.POST.get('description')
            image = request.FILES.get('image')
            video_link = request.POST.get('video_link')
            if image is None:
                print(" 2")
            else:
                content.image = image

            content.title = title
            content.description = description
            
            content.video_link = video_link
            content.save()
            return redirect('mentor:content',id=content.id)
        return render(request, 'mentor/single-content-update.html',context=context)
    else:
        return redirect('dashboard:content',id=id)

@login_required(login_url='/mentor/login/')
def addtagcontent(request, id):
    if request.method == 'POST':
        tag = (request.POST.get('tag')).lower()
        x =int( request.POST.get('catergoryid'))
        print(x)
        print(tag)
        catergory = Catergory.objects.get(id=x)
        content = Content.objects.get(id=id)
        if content.content_tags.filter(Q(name=tag),Q(catergory=catergory)).exists():
            return redirect('mentor:content',id=id)
        else:
            if Skill.objects.filter(Q(name=tag)&Q(catergory=catergory)).exists():
                skill = Skill.objects.get(name=tag,catergory=catergory)
            else:    
                skill = Skill(catergory=catergory,name=tag)
                skill.save()
            content.content_tags.add(skill)
            content.save()
            return redirect('mentor:content',id=id)

def publicprofile(request,username):
    context = {}
    user = User.objects.get(username=username)
    mentorprofile = MentorProfile.objects.get(user=user)
    context['user'] = user
    context['mentorprofile'] = mentorprofile
    content = Content.objects.filter(user=mentorprofile,is_active=True)
    context['content'] = content
    if request.user.user_type == "Mentor":
        return render(request, 'mentor/public-profile.html', context=context)
    else:
        return render(request, 'dashboard/public-profile.html', context=context)

@login_required(login_url='/mentor/login/')
def menteerequests(request,view="all"):
    context = {}
    mentor = request.user.mentorprofile
    if view == "all":
        mentee_requests = MentorRequestTime.objects.filter(request__mentor=mentor)
        context['mentee_requests'] = mentee_requests
    elif view == "pending":
        mentee_requests =MentorRequestTime.objects.filter(request__mentor=mentor,request__accepted=False,request__declined=False)
        context['mentee_requests'] = mentee_requests
    elif view == "accepted":
        mentee_requests =MentorRequestTime.objects.filter(request__mentor=mentor,request__accepted=True,request__declined=False)
        context['mentee_requests'] = mentee_requests
    elif view == "declined":
        mentee_requests = MentorRequestTime.objects.filter(request__mentor=mentor,request__declined=True)
        context['mentee_requests'] = mentee_requests
    return render(request, 'mentor/menteerequests.html', context=context)


@login_required(login_url='/mentor/login/')
def acceptrequest(request,request_id):
    mentee_request = MentorRequest.objects.get(id=request_id)
    mentee_request.accepted = True
    mentee_request.save()
    if MentorMenteeRelations.objects.filter(mentor=request.user.mentorprofile,mentee=mentee_request.mentee).exists():
        mentormentee = MentorMenteeRelations.objects.get(mentor=request.user.mentorprofile,mentee=mentee_request.mentee)
        mentormentee.amount=mentormentee.amount+mentee_request.total_amount
        mentormentee.save()
    else:
        relation = MentorMenteeRelations.objects.create(mentor=request.user.mentorprofile,mentee=mentee_request.mentee,amount= mentee_request.total_amount)
        relation.save()
    return redirect('mentor:menteerequests',view="accpeted")


@login_required(login_url='/mentor/login/')
def declinerequest(request,request_id):
    mentee_request = MentorRequest.objects.get(id=request_id)
    mentee_request.declined = True
    mentee_request.save()
    return redirect('mentor:menteerequests',view="declined")



@login_required(login_url='/mentor/login/')
def addworkinghours(request):
    context = {}
    
    if request.method == 'POST':
        weekday = request.POST.get('weekday')
        from_hour = request.POST.get('from_hour')
        to_hour = request.POST.get('to_hour')
        mentorworkinghours = MentorAvailability(weekday=weekday,from_hour=from_hour,to_hour=to_hour,mentor=request.user.mentorprofile)
        mentorworkinghours.save()
        return redirect('mentor:mentorpage')
    elif request.method == 'DELETE':
        id = request.GET.get('id')
        mentorworkinghours = MentorAvailability.objects.get(id=id)
        mentorworkinghours.delete()
        return redirect('mentor:mentorpage')
    else:
        return redirect('mentor:mentorpage')

@login_required(login_url='/mentor/login/')
def deleteworkinghours(request,id):
    if request.method == 'POST':
        mentorworkinghours = MentorAvailability.objects.get(id=id)
        if request.user.user_type == 'Mentor' and request.user.mentorprofile.id == mentorworkinghours.mentor.id:
            mentorworkinghours.delete()
            return redirect('mentor:mentorpage')
        return redirect('dashboard:home')


@login_required(login_url='/mentor/login/')
def findmentees(request):
    mentees = MenteeProfile.objects.all()
    context = {}
    context['mentees'] = mentees
    catergory = Catergory.objects.all()[0:4]
    context['catergory'] = catergory
    if request.method == 'POST':
        search_text = request.POST.get('search_text')
        print(search_text)
        context['mentees'] = mentees
        return render(request, 'mentor/findmentees.html', context=context)
    return render(request, 'mentor/findmentees.html', context=context)



@login_required(login_url='/mentor/login/')
def catergorymentee(request,category):
    context = {}
    mentee_interests = MenteeInterest.objects.filter(interest__catergory__name__icontains=category).distinct()
    
    print(mentee_interests)
    context['mentee_interests'] = mentee_interests
    tags = Skill.objects.filter(catergory__name=category)[0:4]
    context['tags'] = tags
    print(context['tags'])
    if request.user.user_type == 'Mentee':
        return redirect('dashboard:browse')
    else:
        return render(request, 'mentor/findmentees.html', context=context)

@login_required(login_url='/mentor/login/')
def tagmentee(request,category,tag):
    context = {}
    print(tag)
    mentee_interests = MenteeInterest.objects.filter(interest__name=tag).distinct()
    
   
    tags = Skill.objects.filter(catergory__name=category)[0:4]
    context['tags'] = tags
    context['mentee_interests'] = mentee_interests
    if request.user.user_type == 'Mentee':
        return redirect('dashboard:browse')
    else:
        return render(request, 'mentor/findmentees.html', context=context)

@login_required(login_url='/mentor/login/')
def browsementeetags(request):
    context = {}
    tags = Skill.objects.all()
    context['tags'] = tags
    return render(request, 'mentor/browsementeetags.html', context=context)
