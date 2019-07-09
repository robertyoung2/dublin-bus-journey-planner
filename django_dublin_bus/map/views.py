from django.shortcuts import render
from .models import StopsInfo, BusStops
import requests
from django.core import serializers
from django.http import HttpResponse

# Create your views here.


def home(request):
    stops_info = StopsInfo.objects.all()

    response = requests.get(url='http://api.openweathermap.org/data/2.5/weather?q=Dublin&APPID=0a4fb876c0f4024eff4c1beb5c4d7761')
    weather_data = response.json()
    temp = weather_data['main']['temp_max']
    description = weather_data['weather'][0]['description']
    icon = weather_data['weather'][0]['icon']

    context = {'stops_info': stops_info, 'temp': temp, 'description':description, 'icon':icon}
    return render(request,'map/home.html', context)


def get_routes(request):
    if request.method == "POST":
        stop_id = request.POST['stop_id']
        print("Stop ID:", stop_id)

        routes = BusStops.objects.filter(stop_id=stop_id)
        routes_json = serializers.serialize('json', routes, fields=('bus_numbers',))
        return HttpResponse(routes_json, content_type='application/json')
