from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from meeting.models import Meeting, MeetingRecording
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

pusher_client = Pusher(app_id="1298426",
                       key="06d07740f1d6ef655ab5",
                       secret="012e76edc7d240411c11",
                       ssl=True,
                       cluster="us2"
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
    context['meeting_time'] =( meeting.mentor_time_slot.from_time).strftime('%H:%M:%S')
    print(time_in_range((meeting.mentor_time_slot.from_time).strftime('%H:%M:%S'), (meeting.mentor_time_slot.to_time).strftime('%H:%M:%S'), datetime.datetime.now().strftime('%H:%M:%S')))
    # if datetime.date.today().strftime('%Y-%m-%d')<= (meeting.date).strftime('%Y-%m-%d'):
    #     if ((meeting.start_time).strftime('%H:%M:%S') >= datetime.datetime.now().strftime('%H:%M:%S')):
    #         context['timepassed'] = True
    # else:
    #     context['timepassed'] = False
    context['timepassed']=time_in_range((meeting.mentor_time_slot.from_time).strftime('%H:%M:%S'), (meeting.mentor_time_slot.to_time).strftime('%H:%M:%S'), datetime.datetime.now().strftime('%H:%M:%S'))
    print(meeting.mentee.user.username)
    return render(request, 'meeting/mentee-singlemeeting.html',context=context)

@login_required(login_url="/mentor/login/")
def completemeeting(request,meeting_id):
    meeting = Meeting.objects.get(id=meeting_id)
    meeting.completed = True
    meeting.save()
    mentor_booked_event = MentorBookedEvent.objects.get(mentor_time_slot=meeting.mentor_time_slot)
    mentor_booked_event.is_available_status = True
    mentor_booked_event.save()
    url = "/dashboard/content/{}".format(meeting.content.id)
    message= "{} request session completed".format(meeting.mentor.user.username)
    notify.send(meeting.mentor.user, recipient=meeting.mentee.user, verb='Leave a Review for Content', description=message,url=url)
			
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
    appID = "1ce75471ef8d47a98b262376e207dfee"
    appCertificate = "5fb2b24175d143dc92d159b2d9681461"
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

@login_required(login_url="/mentor/login/")
def create_recording(request):
    body = json.loads(request.body.decode('utf-8'))
    sid = body['sid']
    resourceId = body['resourceId']
    meetingid = int(body['meetingid'])
    mentor = request.user.mentorprofile
    meeting = Meeting.objects.get(id=meetingid)
    meeting_recording=MeetingRecording(sid=sid,resourceId=resourceId,meeting=meeting,mentor=mentor,content=meeting.content)
    meeting_recording.save()
    return JsonResponse({'message': 'recording has been created', 'success': True})

@login_required(login_url="/mentor/login/")
def stop_recording_request(request):
    body = json.loads(request.body.decode('utf-8'))
    meetingid = int(body['meetingid'])
    resourceId = body['resourceId']
    meeting = Meeting.objects.get(id=meetingid)
    meeting_recording = MeetingRecording.objects.filter(meeting=meeting).last()
    meeting_recording.resourceId = resourceId
    meeting_recording.save()
    return JsonResponse({'message': 'recording has been stopped', 'success': True,'sid':meeting_recording.sid,'resourceId':meeting_recording.resourceId})

@login_required(login_url="/mentor/login/")
def recording_completed(request):
    body = json.loads(request.body.decode('utf-8'))
    meetingid = int(body['meetingid'])
    meeting = Meeting.objects.get(id=meetingid)
    meeting_recording = MeetingRecording.objects.filter(meeting=meeting).last()
    meeting_recording.stopresponse = body['record_completion']
    meeting_recording.save()
    return JsonResponse({'message': 'recording has been completed', 'success': True})