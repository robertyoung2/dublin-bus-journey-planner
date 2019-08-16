from django.shortcuts import render
from django_dublin_bus.settings import BASE_DIR
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse

from .models import StopsInfo, BusStops, Holidays

import difflib, datetime, os, time, pickle, json, requests
import pandas as pd
from math import cos, asin, sqrt


# Create your views here
def home(request):
    stops_info = StopsInfo.objects.all()
    context = {'bus_stops': stops_info}
    return render(request,'map/home.html', context)


def get_routes(request):
    if request.method == "POST":
        data_dict = json.loads(request.POST["json_data"])
        routes = list(BusStops.objects.filter(stop_id=data_dict['stop_id']).values())

        rts_info = requests.get('http://data.smartdublin.ie/cgi-bin/rtpi//realtimebusinformation?stopid='+data_dict['actual_stop_id']+'&format=json')
        rts_info_results = rts_info.json()['results']
        rts_info_list = []

        for result in rts_info_results:
            bus_due_info = {"route": result['route'], "duetime": result['duetime'],
                            "destination": result['destination']}
            rts_info_list.append(bus_due_info)

        routes_served_RTS = json.dumps([routes, rts_info_list])

        return HttpResponse(routes_served_RTS, content_type="application/json")


def run_model(request):
    if request.method == "POST":
        data = request.POST.get('data')
        data = json.loads(data)

        path_csv = os.path.join(BASE_DIR, 'map/ml_models/csv/')
        path_xgbr_models = os.path.join(BASE_DIR, 'map/ml_models/xgbr_models/')

        df = pd.read_csv(path_csv+'ordered_stops_segment_goahead_fixed.csv')
        weather_df = pd.read_csv(path_csv+'168_hours_weather.csv', parse_dates=['ts_weather'])

        predictions = []

        for journey in data:
            journey_results = {}

            for route in journey:
                headsign_options = list(df.loc[df['route'] == route]['destination'].unique())
                journey_results[route] = []

                arr_time = journey[route]['Departure_Datetime']
                arr_time = arr_time.replace("T", " ")
                arr_time = arr_time.replace("Z", "")
                arr_time = datetime.datetime.strptime(arr_time, '%Y-%m-%d %H:%M:%S.%f')
                firststoparrival = int(time.mktime(arr_time.timetuple()))

                weekdays = [0, 0, 0, 0, 0, 0, 0]
                weekdays[arr_time.weekday()] = 1

                hour = arr_time.hour

                try:
                    holiday = Holidays.objects.get(date=arr_time.date())
                except Holidays.DoesNotExist:
                    holiday = {"public_holiday": False, "primary_holiday": False, "secondary_holiday": False}

                headsign = journey[route]['Destination']
                headsign = difflib.get_close_matches(headsign, headsign_options, n=1)
                segments = []
                missing_segments = []

                if len(headsign) != 0:
                    headsign = headsign[0]
                    route_stop_list = df.loc[(df['route'] == route) & (df['destination'] == headsign)].to_dict('records')

                    if len(route_stop_list) != 0:
                        journey_org_dest = closest(route_stop_list, journey[route])

                        first_row = True
                        origin_reached = False

                        for stop in route_stop_list:
                            if stop['stopid'] == journey_org_dest['Origin_Stop']['stopid']:
                                origin_reached = True

                            if origin_reached == True:
                                if first_row == True:
                                    first_row = False
                                else:
                                    segments.append(stop['SEGMENT'])

                                if stop['stopid'] == journey_org_dest['Destination_Stop']['stopid']:
                                    break

                        rounded_arr_time = round_to_hour(arr_time)
                        nearest_weather = weather_df.loc[weather_df['ts_weather'] == rounded_arr_time]
                        temp = float(nearest_weather['temp_c'])
                        rain = float(nearest_weather['rain_mm'])

                        for segment in segments:
                            if os.path.isfile(path_xgbr_models + segment + "_pickle.sav"):
                                loaded_model = pickle.load(open(path_xgbr_models + segment + "_pickle.sav", 'rb'))

                                model_data = [[firststoparrival, hour, rain, temp, int(holiday.primary_holiday),
                                               int(holiday.secondary_holiday),
                                               int(holiday.public_holiday), weekdays[0], weekdays[1], weekdays[2],
                                               weekdays[3], weekdays[4], weekdays[5], weekdays[6]]]

                                model_df = pd.DataFrame(model_data, columns=['FIRSTSTOPARRIVAL', 'HOUR', 'rain', 'temp',
                                                                             'PRIMARYHOLIDAY',
                                                                             'SECONDARYHOLIDAY', 'PUBLICHOLIDAY',
                                                                             'DAY_OF_WEEK_Monday',
                                                                             'DAY_OF_WEEK_Tuesday', 'DAY_OF_WEEK_Wednesday',
                                                                             'DAY_OF_WEEK_Thursday',
                                                                             'DAY_OF_WEEK_Friday', 'DAY_OF_WEEK_Saturday',
                                                                             'DAY_OF_WEEK_Sunday'])

                                journey_time = int(loaded_model.predict(model_df))
                                journey_results[route].append(journey_time)
                                firststoparrival += journey_time

                            else:
                                missing_segments.append(segment)
                                journey_results[route] = []
                                break

            predictions.append(journey_results)

        predictions = json.dumps(predictions)

        return HttpResponse(predictions, content_type='application/json')


def distance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
    return 12742 * asin(sqrt(a))


def closest(data, v):
    return {"Origin_Stop": min(data, key=lambda p: distance(v['Origin_Lat'],v['Origin_Lon'],p['latitude'],p['longitude'])),
            "Destination_Stop": min(data, key=lambda p: distance(v['Dest_Lat'],v['Dest_Lon'],p['latitude'],p['longitude']))}


def round_to_hour(dt):
    dt_start_of_hour = dt.replace(minute=0, second=0, microsecond=0)
    dt_half_hour = dt.replace(minute=30, second=0, microsecond=0)

    if dt >= dt_half_hour:
        # round up
        dt = dt_start_of_hour + datetime.timedelta(hours=1)
    else:
        # round down
        dt = dt_start_of_hour

    return dt


@ensure_csrf_cookie
def get_sun(request):

    path_csv = os.path.join(BASE_DIR, 'map/ml_models/csv/')

    if request.method == "POST":
        df = pd.read_csv(path_csv + 'sunrise_sunset.csv')
        sunrise = int(df.iloc[0]['ts_sunrise'])
        sunset = int(df.iloc[0]['ts_sunset'])
        sunrise_sunset_times = {"sunrise": sunrise, "sunset": sunset}
        sunrise_sunset_times = json.dumps(sunrise_sunset_times)

        return HttpResponse(sunrise_sunset_times, content_type='application/json')