from django.shortcuts import render
from .models import StopsInfo, BusStops
import requests

# Create your views here.


def home(request):
    stops_info = StopsInfo.objects.all()
    bus_info = BusStops.objects.all()

    response = requests.get(url='http://api.openweathermap.org/data/2.5/weather?q=Dublin&APPID=0a4fb876c0f4024eff4c1beb5c4d7761')
    weather_data = response.json()
    temp = weather_data['main']['temp_max']
    description = weather_data['weather'][0]['description']
    icon = weather_data['weather'][0]['icon']

    context = {'stops_info': stops_info, 'bus_info':bus_info, 'temp': temp, 'description':description, 'icon':icon}
    return render(request,'map/home.html', context)
