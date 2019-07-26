#!/usr/bin/env python3

# Script that to load each route and add new features to it using chunking for memory efficiency
# Features that are added are: year-month-date, weather, school and public holidays
# Checks to make sure the new route_feature dataset has not been created already

import pandas as pd
import numpy as np
import os
import requests
import calendarific
from datetime import datetime

path = '/home/student/data/data_splits/route_data_files/'
path_new_datasets = '/home/student/data/data_splits/route_datasets_features/'

already_created = []
for filename in os.listdir(path_new_datasets):
    already_created.append(filename)
    
# only need to call this once
response = requests.get('https://calendarific.com/api/v2/holidays?&api_key=c2f61a8958c47b9cabd2df7cd4b58b5fec31cfef&type=national&country=IE&year=2018')
data = response.json()

columns_to_load = ['DAYOFSERVICE','PROGRNUMBER','STOPPOINTID', 'PLANNEDTIME_ARR', 'PLANNEDTIME_DEP'
                   ,'ACTUALTIME_ARR','ACTUALTIME_DEP', 'ROUTEID','DIRECTION', 'TRIPID']

weather_to_load = ['date', 'temp', 'rain']

for filename in os.listdir(path):
	if filename[:-4] + "features.csv" not in already_created:
		print("Hello Conor and Rob, I'm currently working on ", filename)
		
		df_chunk = pd.read_csv(path+filename, chunksize=100000, usecols= columns_to_load, dtype =
	                     {"PROGRNUMBER":np.int16, "STOPPOINTID":np.int16, "PLANNEDTIMED_ARR":np.int32, "TRIPID":np.int32, 
	                     "PLANNEDTIMED_DEP":np.int32, "ACTUALTIME_ARR":np.int32, "ACTUALTIME_DEP":np.int32,"DIRECTION":np.int8,},engine='python')
		pass_count = 1
		print("This is pass number", pass_count)

		for data_trips in df_chunk:
	

			# Creating date time objects
			data_trips['DAYOFSERVICE'] = pd.to_datetime(data_trips['DAYOFSERVICE'], format='%d-%b-%y %H:%M:%S').dt.date
			data_trips['PLANNEDTIME_ARR'] = pd.to_datetime(data_trips['PLANNEDTIME_ARR'], unit='s').dt.time
			data_trips['PLANNEDTIME_ARR'] = data_trips.apply(lambda df : pd.datetime.combine(df['DAYOFSERVICE'],df['PLANNEDTIME_ARR']),1)
			data_trips['PLANNEDTIME_DEP'] = pd.to_datetime(data_trips['PLANNEDTIME_DEP'], unit='s').dt.time
			data_trips['PLANNEDTIME_DEP'] = data_trips.apply(lambda df : pd.datetime.combine(df['DAYOFSERVICE'],df['PLANNEDTIME_DEP']),1)
			data_trips['ACTUALTIME_ARR'] = pd.to_datetime(data_trips['ACTUALTIME_ARR'], unit='s').dt.time
			data_trips['ACTUALTIME_ARR'] = data_trips.apply(lambda df : pd.datetime.combine(df['DAYOFSERVICE'],df['ACTUALTIME_ARR']),1)
			data_trips['ACTUALTIME_DEP'] = pd.to_datetime(data_trips['ACTUALTIME_DEP'], unit='s').dt.time
			data_trips['ACTUALTIME_DEP'] = data_trips.apply(lambda df : pd.datetime.combine(df['DAYOFSERVICE'],df['ACTUALTIME_DEP']),1)



			# Linking weather data to dataset
			data_weather = pd.read_csv('weather_data_2018.csv', usecols= weather_to_load)
			# data_weather = data_weather.drop(['wetb', 'dewpt', 'vappr', 'rhum', 'msl'], axis = 1)
			data_weather['date'] = pd.to_datetime(data_weather.date)
			data_weather["join"] = data_weather['date'].dt.strftime('%d %m %y %H')
			data_trips["join"] = data_trips['ACTUALTIME_DEP'].dt.strftime('%d %m %y %H')
			data_trips = data_trips.join(data_weather.set_index('join'), on='join')
			data_trips = data_trips.drop(columns=['join', 'date'])


			# School Holidays
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


			data_trips["SECONDARYHOLIDAY"] = None
			data_trips.loc[data_trips["DAYOFSERVICE"].isin(secondary_holidays_full), "SECONDARYHOLIDAY"] = "Yes"
			data_trips.loc[~data_trips["DAYOFSERVICE"].isin(secondary_holidays_full), "SECONDARYHOLIDAY"] = "No"

			data_trips["PRIMARYHOLIDAY"] = None
			data_trips.loc[data_trips["DAYOFSERVICE"].isin(primary_holidays_full), "PRIMARYHOLIDAY"] = "Yes"
			data_trips.loc[~data_trips["DAYOFSERVICE"].isin(primary_holidays_full), "PRIMARYHOLIDAY"] = "No"



			# Add public/national holidays for 2018
			public_holidays = []
			for holiday in data['response']['holidays']:
			    current_holiday = (holiday['date']['datetime'])
			    holiday_string = str(current_holiday['year']) + str(current_holiday['month']) + str(current_holiday['day'])
			    datetime_object = pd.to_datetime(holiday_string, format='%Y%m%d', errors='ignore').date()
			    public_holidays.append(datetime_object)

			data_trips["PUBLICHOLIDAY"] = None
			data_trips.loc[data_trips["DAYOFSERVICE"].isin(public_holidays), "PUBLICHOLIDAY"] = "Yes"
			data_trips.loc[~data_trips["DAYOFSERVICE"].isin(public_holidays), "PUBLICHOLIDAY"] = "No"


			if pass_count == 1:
				include_header = True
			else:
				include_header = False

			with open(path_new_datasets+filename[:-4]+ "features.csv", 'a') as file_append:
				data_trips.to_csv(file_append, header=include_header, index = False ) 
				file_append.close()

			pass_count += 1

			already_created.append(filename)










