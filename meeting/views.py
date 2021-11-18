from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from meeting.models import Meeting
import os
import time
import json

from django.http.response import JsonResponse
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required

from django.shortcuts import render

from .agora_key.RtcTokenBuilder import RtcTokenBuilder, Role_Attendee
from pusher import Pusher
# Create your views here.
import datetime
from notifications.signals import notify
from users.models import *

pusher_client = Pusher(app_id=os.environ.get('PUSHER_APP_ID'),
                       key=os.environ.get('PUSHER_KEY'),
                       secret=os.environ.get('PUSHER_SECRET'),
                       ssl=True,
                       cluster=os.environ.get('PUSHER_CLUSTER')
                       )



@login_required(login_url="/mentor/login/")
def callyourmentee(request,meeting_id):
    context={}
    meeting = Meeting.objects.get(id=meeting_id)
    context['meeting'] = meeting
    context['mentee'] = meeting.mentee
    context ['content'] = meeting.content
    print(meeting.mentee.user.username)

    return render(request, 'meeting/callyourmentee.html',context=context)

def time_in_range(start, end, current):
    """Returns whether current is in the range [start, end]"""
    return start <= current <= end

@login_required(login_url="/dashboard/login/")
def connectcallmentee(request,meeting_id):
    context={}
    meeting = Meeting.objects.get(id=meeting_id)
    context['meeting'] = meeting
    context['mentor'] = meeting.mentor
    context ['content'] = meeting.content
    context['meeting_time'] =( meeting.start_time).strftime('%H:%M:%S')
    print(time_in_range((meeting.start_time).strftime('%H:%M:%S'), (meeting.end_time).strftime('%H:%M:%S'), datetime.datetime.now().strftime('%H:%M:%S')))
    # if datetime.date.today().strftime('%Y-%m-%d')<= (meeting.date).strftime('%Y-%m-%d'):
    #     if ((meeting.start_time).strftime('%H:%M:%S') >= datetime.datetime.now().strftime('%H:%M:%S')):
    #         context['timepassed'] = True
    # else:
    #     context['timepassed'] = False
    context['timepassed']=time_in_range((meeting.start_time).strftime('%H:%M:%S'), (meeting.end_time).strftime('%H:%M:%S'), datetime.datetime.now().strftime('%H:%M:%S'))
    print(meeting.mentee.user.username)
    return render(request, 'meeting/mentee-singlemeeting.html',context=context)

@login_required(login_url="/mentor/login/")
def completemeeting(request,meeting_id):
    meeting = Meeting.objects.get(id=meeting_id)
    meeting.completed = True
    meeting.save()
    url = "/dashboard/completedsessions/".format(meeting.id)
    message= "{} request session completed".format(meeting.mentor.user.username)
    notify.send(meeting.mentor.user, recipient=meeting.mentee.user, verb='Session Completed', description=message,url=url)
			
    return redirect('mentor:menteerequests',view="all")

@login_required(login_url="/mentor/login/")
def schedulemeeting(request,mentorequest_id):
    mentee_request = MentorRequest.objects.get(id=mentorequest_id)
    if request.method == "POST":
        startime = request.POST.get('starttime')
        endtime = request.POST.get('endtime')
        print(startime)
        print(endtime)
        meeting_title = mentee_request.content.title + " requested by " + mentee_request.mentee.user.username
        meeting = Meeting(mentor=mentee_request.mentor,mentee=mentee_request.mentee,meeting_title=meeting_title,meeting_subject=meeting_title,start_time=startime,end_time=endtime,date=mentee_request.mentorrequesttime.date,meeting_request=mentee_request,content=mentee_request.content)
        meeting.save()
        mentee_request.accepted = True
        mentee_request.save()
        url = "/meeting/connectcallmentee/{}".format(meeting.id)
        message= "{} request accepted request for {}".format(meeting.mentor.user.username,meeting.content.title)
        notify.send(meeting.mentor.user, recipient=meeting.mentee.user, verb='Call Accepted', description=message,url=url)
			

        if MentorMenteeRelations.objects.filter(mentor=request.user.mentorprofile,mentee=mentee_request.mentee).exists():
            mentormentee = MentorMenteeRelations.objects.get(mentor=request.user.mentorprofile,mentee=mentee_request.mentee)
            print("related")
            mentormentee.save()
        else:
            print("no related")
            relation = MentorMenteeRelations.objects.create(mentor=request.user.mentorprofile,mentee=mentee_request.mentee,amount= mentee_request.total_amount)
            relation.save()
    return redirect('mentor:startmeeting')




def pusher_auth(request):
    payload = pusher_client.authenticate(
        channel=request.POST['channel_name'],
        socket_id=request.POST['socket_id'],
        custom_data={
            'user_id': request.user.id,
            'user_info': {
                'id': request.user.id,
                'name': request.user.username
            }
        })
    return JsonResponse(payload)


def generate_agora_token(request):
    appID = os.environ.get('AGORA_APP_ID')
    appCertificate = os.environ.get('AGORA_APP_CERTIFICATE')
    channelName = json.loads(request.body.decode(
        'utf-8'))['channelName']
    userAccount = request.user.username
    expireTimeInSeconds = 3600
    currentTimestamp = int(time.time())
    privilegeExpiredTs = currentTimestamp + expireTimeInSeconds

    token = RtcTokenBuilder.buildTokenWithAccount(
        appID, appCertificate, channelName, userAccount, Role_Attendee, privilegeExpiredTs)
    print(token)
    return JsonResponse({'token': token, 'appID': appID})


def call_user(request):
    body = json.loads(request.body.decode('utf-8'))

    user_to_call = body['user_to_call']
    channel_name = body['channel_name']
    caller = request.user.id

    pusher_client.trigger(
        'presence-online-channel',
        'make-agora-call',
        {
            'userToCall': user_to_call,
            'channelName': channel_name,
            'from': caller
        }
    )
    return JsonResponse({'message': 'call has been placed'})