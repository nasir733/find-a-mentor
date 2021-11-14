from django.http.response import JsonResponse
from django.shortcuts import render, redirect
from django.template import context, loader, RequestContext
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseBadRequest

from django.contrib.auth.decorators import login_required

from direct.models import Message,Room


from django.db.models import Q
from django.core.paginator import Paginator

from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_protect,csrf_exempt
import pprint
from notifications.signals import notify

from users.models import *
User = get_user_model()

@login_required
def Directs(request, username):
	context = {}
	user = request.user
	active_direct = username
	rooms = Room.objects.filter(Q(mentor=user) | Q(mentee=user))
	if user.user_type == 'Mentor':
		if Room.objects.filter(mentor=user,mentee__username=active_direct).exists():
			room = Room.objects.get(mentor=user,mentee__username=active_direct)
		else:
			room_name = user.username+'_'+active_direct
			room = Room.objects.create(name=room_name,mentor=user, mentee=User.objects.get(username=active_direct))
			
			
		context = {
			'active_direct':active_direct,
			
			'room':room,
			'rooms':rooms,
	}
	elif user.user_type == 'Mentee':
		if Room.objects.filter(mentee=user,mentor__username=active_direct).exists():
			room = Room.objects.get(mentee=user,mentor__username=active_direct)
		else:
			
			room_name = user.username+'_'+active_direct
			room = Room.objects.create(name=room_name,mentee=user, mentor=User.objects.get(username=active_direct),menter_username=active_direct,mentee_username=user.username)
			url = "/direct/room/{}".format(room.mentor.username)
			notify.send(user, recipient=room.mentor, verb='Message', description="{} started new conversation".format(user.username),url=url)
			print("hellooooo")
		context = {
			'active_direct':active_direct,
			
			'room':room,
			"rooms":rooms,
	}
	
	else:
		return redirect('dashboard:home')
		
	
	return render(request, 'direct/direct.html', context)

@login_required
def userrooms(request):
	user = request.user
	if request.method == 'GET':
		if Room.objects.filter(Q(mentor=user) | Q(mentee=user)).exists():
			rooms = Room.objects.filter(Q(mentor=user) | Q(mentee=user))
			room_list =list(rooms.values())
			context = {
					"rooms":room_list,
			}
		else:
			context = {
					"rooms":[],
			}
		return JsonResponse(context)
	else:
		return HttpResponseBadRequest()

@login_required
def SendDirect(request,room_id):
	from_user = request.user
	room = Room.objects.get(id=room_id)
	if request.method == 'POST':
		body = request.POST.get('text')
		if from_user.user_type == "Mentor" :
			url = "/direct/room/{}".format(room.mentee.username)
			message = Message(user=from_user, text=body,room=room,user_name=from_user.username)
			message.save()
			notify.send(from_user, recipient=room.mentee, verb='Message', description=body,url=url)
			room.mentee.is_new_message = True
			room.is_new_message = True
			room.save()
			return redirect('directs:room',room.mentee.username)
		elif from_user.user_type == "Mentee":
			url = "/direct/room/{}".format(room.mentor.username)
			message = Message(user=from_user, text=body,room=room,user_name=from_user.username)
			message.save()
			notify.send(from_user, recipient=room.mentor, verb='Message', description=body,url=url)
			
			room.mentor.is_new_message = True
			room.is_new_message = True
			room.save()
			return redirect('directs:room',room.mentor.username)
		else:
			return redirect('dashboard:home')
	elif request.method == 'GET':
		try:
			messages = Message.objects.filter(Q(user=room.mentor) | Q(user=room.mentee),room=room)
			room.is_new_message = False
			room.save()
			return JsonResponse({
				"messages":list(messages.values()),
				})
		except:
			return JsonResponse({
				"messages":[],
				})
			
	else:
		return JsonResponse({"messages":"no messges"})