from django.shortcuts import render
from django.http import HttpResponse
from .models import StopsInfo
# Create your views here.

def home(request):
    stops_info = StopsInfo.objects.all()
    context = {'stops_info': stops_info}
    return render(request,'map/home.html', context)

