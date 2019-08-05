#!/usr/bin/env python

# Script to scrape dark sky API and produce csv with next 168 hours (7 days) of rain mm and temp C

import pandas as pd
import traceback
import requests
import datetime
import calendar
import time


try:
    response = requests.get('https://api.darksky.net/forecast/95ab53fceccb16cedea7ed90b54c167d/53.3498,-6.2603?'
                            'extend=hourly&exclude=minutely,alerts,flags&units=auto')
    weather_data = response.json()
    df = pd.DataFrame(columns=['ts_recorded_data', 'ts_unix_recorded_data', 'ts_weather', 'ts_unix_weather', 'rain_mm', 'temp_c'],
                          index = range(0,169))

    for item_num in range(169):
        current_time =  calendar.timegm(time.gmtime())
        df.iloc[item_num]['ts_unix_recorded_data'] = current_time
        df.iloc[item_num]['ts_recorded_data'] = datetime.datetime.utcfromtimestamp(current_time).strftime('%Y-%m-%d %H:%M:%S')
        ts_weather = int(weather_data['hourly']['data'][item_num]['time'])
        df.iloc[item_num]['ts_weather'] = datetime.datetime.utcfromtimestamp(ts_weather).strftime('%Y-%m-%d %H:%M:%S')
        df.iloc[item_num]['ts_unix_weather'] = ts_weather
        df.iloc[item_num]['temp_c'] = (weather_data['hourly']['data'][item_num]['temperature'])
        df.iloc[item_num]['rain_mm'] = (weather_data['hourly']['data'][item_num]['precipIntensity'])

    df.to_csv('168_hours_weather.csv', header=True)

except:
    f = open("logTracebackError.log", "a+")
    print(traceback.format_exc())
    f.write(traceback.format_exc())
    f.close()