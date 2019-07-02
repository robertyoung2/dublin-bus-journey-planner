from django.shortcuts import render
from django.http import HttpResponse
from .models import StopsInfo
# Create your views here.

def home(request):
    bus_stops = StopsInfo.objects.all()
    context = {'bus_stops': bus_stops}
    return render(request,'map/home.html', context)

