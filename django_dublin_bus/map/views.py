from django.shortcuts import render
from .models import StopsInfo, BusStops
import requests
from django.core import serializers
from django.http import HttpResponse
import csv
import json
import os
from django_dublin_bus.settings import BASE_DIR
# Create your views here.


def home(request):
    stops_info = StopsInfo.objects.all()

    response = requests.get(url='http://api.openweathermap.org/data/2.5/weather?q=Dublin&APPID=0a4fb876c0f4024eff4c1beb5c4d7761')
    weather_data = response.json()
    temp = weather_data['main']['temp_max']
    description = weather_data['weather'][0]['description']
    icon = weather_data['weather'][0]['icon']

    # Change stops_info to bus_stops
    context = {'bus_stops': stops_info, 'temp': temp, 'description':description, 'icon':icon}
    return render(request,'map/home.html', context)


def get_routes(request):
    if request.method == "POST":
        stop_id = request.POST['stop_id']
        # print("Stop ID:", stop_id)

        # In our django query see is it more efficient to return only bus_numbers field
        routes = BusStops.objects.filter(stop_id=stop_id)
        routes_json = serializers.serialize('json', routes, fields=('bus_numbers','stop_headsign'))
        return HttpResponse(routes_json, content_type='application/json')


def run_model(request):
    if request.method == "POST":
        data = request.POST.get('data[]', False)
        print("Data in Backend:", data)


        predictions = [{'47':[2, 3, 4, 2, 3, 4], '11':[7, 5, 3, 5, 6, 7]}, {'3':[9, 6, 4, 2, 66, 7, 4], '75':[9, 2, 5, 6, 4, 3, 4, 6, 8, 6]}]
        predictions = json.dumps(predictions)
        return HttpResponse(predictions, content_type='application/json')


def get_sun(request):
    if request.method == "POST":

        path_csv = os.path.join(BASE_DIR, 'map/ml_models/csv/')
        with open(path_csv+'sunrise_sunset.csv', 'r') as csvfile:
            reader = csv.reader(csvfile)

            first_row = True
            for row in reader:
                if first_row:
                    first_row = False
                else:
                    sunrise = row[2]
                    sunset = row[3]
                    break

        sun = {"sunrise": sunrise, "sunset": sunset}
        sun = json.dumps(sun)

        return HttpResponse(sun, content_type='application/json')
