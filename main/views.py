from django.shortcuts import render, redirect
from .forms import ContactForm
# Create your views here.
from django.contrib import messages


def about(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    return render(request, 'about.html', {})


def case_studies(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    return render(request, 'case-studies.html', {})


def contact(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
    else:
        form = ContactForm()

    return render(request, 'contact.html', {})


def send_email(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    return render(request, 'send_email.html', {})


def sendesta(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    return render(request, 'sendesta.html', {})


def vukode(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    return render(request, 'vukode.html', {})


def ziteso(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    return render(request, 'ziteso.html', {})


def bradstreet(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    return render(request, 'bradstreet.html', {})


def services(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    return render(request, 'services.html', {})


def team(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    return render(request, 'team.html', {})


def testimonial(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    return render(request, 'testimonial.html', {})


def index(request):
    if request.user.is_authenticated:
        messages.info(request, 'You have been already logged in')
        return redirect('dashboard:home')
    return render(request, 'index.html', {})
