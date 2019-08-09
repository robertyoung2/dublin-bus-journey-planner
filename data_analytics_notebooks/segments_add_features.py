#!/usr/bin/env python3

import pandas as pd
import numpy as np
import os
import requests
import calendarific
from datetime import datetime

path_root = '/home/student/data/data_splits/'
path_segments = '/home/student/data/data_splits/segmentation_databases/'
path_weather = '/home/student/data/'

# only need to call this once
response = requests.get(
    'https://calendarific.com/api/v2/holidays?&api_key=c2f61a8958c47b9cabd2df7cd4b58b5fec31cfef&type=national&country=IE&year=2018')
data = response.json()

weather_to_load = ['date', 'temp', 'rain']

column_titles = ['TRIPID', 'PROGRNUMBER', 'STOPPOINTID', 'ACTUALTIME_ARR', 'DATEOFSERVICE', 'HOUR',
                 'SEGMENT', 'FIRSTSTOPARRIVAL', 'JOURNEYTIME']


def add_features():
    for filename in os.listdir(path_segments):

        segment_list = [line.rstrip('\n') for line in open(path_root + 'segments_features_processed.txt')]
        if filename not in segment_list:

            df = pd.read_csv(path_segments + filename, header=None, names=column_titles)

            # Creating a column for the date and time to allow the join with weather
            df['TIMEJOIN'] = pd.to_datetime(df['ACTUALTIME_ARR'], unit='s').dt.time
            df['DATEOFSERVICE'] = pd.to_datetime(df['DATEOFSERVICE'], format='%Y-%m-%d')
            df['TIMEJOIN'] = df.apply(lambda df: pd.datetime.combine(df['DATEOFSERVICE'], df['TIMEJOIN']), 1)

            # Joining the weather data
            data_weather = pd.read_csv(path_weather + 'weather_data_2018.csv', usecols=weather_to_load)
            data_weather['date'] = pd.to_datetime(data_weather.date)
            data_weather["join"] = data_weather['date'].dt.strftime('%d %m %y %H')
            df["join"] = df['TIMEJOIN'].dt.strftime('%d %m %y %H')
            df = df.join(data_weather.set_index('join'), on='join')
            df = df.drop(columns=['join', 'date', 'TIMEJOIN'])

            # Adding holidays
            october_school_holiday_2017 = pd.date_range(start='30 Oct 2017', end='5 Nov 2017')
            christmas_school_holiday_2017 = pd.date_range(start='22 Dec 2017', end='7 Jan 2018')
            easter_school_holiday_2017 = pd.date_range(start='23 March 2018', end='9 Apr 2018')
            primary_february_school_holiday_2017 = pd.date_range(start='15 Feb 2018', end='16 Feb 2018')
            secondary_february_school_holiday_2017 = pd.date_range(start='12 Feb 2018', end='16 Feb 2018')
            secondary_summer_2017 = pd.date_range(start='28 May 2018', end='27 Aug 2018')
            primary_summer_2017 = pd.date_range(start='25 Jun 2018', end='27 Aug 2018')
            october_school_holiday_2018 = pd.date_range(start='29 Oct 2018', end='2 Nov 2018')
            christmas_school_holiday_2018 = pd.date_range(start='24 Dec 2018', end='4 Jan 2019')
            easter_school_holiday_2018 = pd.date_range(start='15 Apr 2019', end='26 Apr 2019')
            secondary_february_school_holiday_2018 = pd.date_range(start='18 Feb 2019', end='22 Feb 2019')
            primary_february_school_holiday_2018 = pd.date_range(start='21 Feb 2019', end='22 Feb 2019')
            secondary_summer_2018 = pd.date_range(start='3 Jun 2019', end='1 Sep 2019')
            primary_summer_2018 = pd.date_range(start='24 Jun 2019', end='1 Sep 2019')
            october_school_holiday_2019 = pd.date_range(start='28 Oct 2019', end='1 Nov 2019')
            christmas_school_holiday_2019 = pd.date_range(start='23 Dec 2019', end='3 Jan 2020')
            easter_school_holiday_2019 = pd.date_range(start='6 Apr 2020', end='17 Apr 2020')
            secondary_february_school_holiday_2019 = pd.date_range(start='17 Feb 2020', end='21 Feb 2020')
            primary_february_school_holiday_2019 = pd.date_range(start='20 Feb 2020', end='21 Feb 2020')
            secondary_summer_2019 = pd.date_range(start='1 Jun 2020', end='31 Aug 2020')
            primary_summer_2019 = pd.date_range(start='22 Jun 2020', end='31 Aug 2020')

            school_holidays = [october_school_holiday_2018, christmas_school_holiday_2018,
                               easter_school_holiday_2018, october_school_holiday_2019,
                               christmas_school_holiday_2019, easter_school_holiday_2019]

            secondary_holidays = [secondary_summer_2017, secondary_summer_2018,
                                  secondary_summer_2019, secondary_february_school_holiday_2017,
                                  secondary_february_school_holiday_2018, secondary_february_school_holiday_2019]

            primary_holidays = [primary_summer_2017, primary_summer_2018,
                                primary_summer_2019, primary_february_school_holiday_2017,
                                primary_february_school_holiday_2018, primary_february_school_holiday_2019]

            holidays = []

            for holiday in school_holidays:
                for date in holiday:
                    holidays.append(date.date())

            secondary_holidays_full = holidays.copy()
            for sholiday in secondary_holidays:
                for sdate in sholiday:
                    secondary_holidays_full.append(sdate.date())

            primary_holidays_full = holidays.copy()
            for pholiday in primary_holidays:
                for pdate in pholiday:
                    primary_holidays_full.append(pdate.date())

            df["SECONDARYHOLIDAY"] = None
            df.loc[df["DATEOFSERVICE"].isin(secondary_holidays_full), "SECONDARYHOLIDAY"] = "Yes"
            df.loc[~df["DATEOFSERVICE"].isin(secondary_holidays_full), "SECONDARYHOLIDAY"] = "No"

            df["PRIMARYHOLIDAY"] = None
            df.loc[df["DATEOFSERVICE"].isin(primary_holidays_full), "PRIMARYHOLIDAY"] = "Yes"
            df.loc[~df["DATEOFSERVICE"].isin(primary_holidays_full), "PRIMARYHOLIDAY"] = "No"

            public_holidays = []
            for holiday in data['response']['holidays']:
                current_holiday = (holiday['date']['datetime'])
                holiday_string = str(current_holiday['year']) + str(current_holiday['month']) + str(
                    current_holiday['day'])
                datetime_object = pd.to_datetime(holiday_string, format='%Y%m%d', errors='ignore').date()
                public_holidays.append(datetime_object)

            df["PUBLICHOLIDAY"] = None
            df.loc[df["DATEOFSERVICE"].isin(public_holidays), "PUBLICHOLIDAY"] = "Yes"
            df.loc[~df["DATEOFSERVICE"].isin(public_holidays), "PUBLICHOLIDAY"] = "No"

            df.to_csv(path_segments + filename, header=True, index=False)

            with open(path_root + 'segments_features_processed.txt', 'a+') as f:
                f.write("%s\n" % filename)


add_features()

