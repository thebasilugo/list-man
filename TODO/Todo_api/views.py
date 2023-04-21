from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
#from .models import User
# Create your views here.
#user = User.objects.all()

def home(request):

    return render(request, "registration/home.html")

def submit_form(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password1 == password2:
            # Process the data here
            user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password2,
                )
            login(request, user)
            return redirect('home')
        # else:
        #     return render('signup.html', error_message=error_message)
    # else:
    #     return render(request, 'registration/login.html'))

def submit_form_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Process the data here
        user = get_object_or_404(User, email=email,password=password)
        login(request, user)
        return redirect('home')
