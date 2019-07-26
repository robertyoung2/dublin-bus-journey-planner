#!/usr/bin/env python3

# Script that takes each route dataset and breaks them down into segmentation datasets

# Import required libraries 
import pandas as pd
import numpy as np
import os
import requests
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import make_scorer
import datetime
import time
import mysql.connector

path = '/home/student/data/data_splits/route_datasets_refined/'
path_segments = '/home/student/data/data_splits/route_data_files/segmentation_databases/'
path_processed_routes = '/home/student/data/data_splits/'

def dataframe_transformation(current_file, path):

	# Load in the required csv and set dtypes and features
	columns_to_load = ['DAYOFSERVICE','TRIPID', 'PROGRNUMBER', 'STOPPOINTID',
	                  'ACTUALTIME_ARR']
	dtype={"PROGRNUMBER":np.int8, "STOPPOINTID":np.int16, "TRIPID":np.int32, "ACTUALTIME_ARR":np.int32}
	df = pd.read_csv(path + current_file, usecols=columns_to_load, dtype=dtype,engine='python')

	# Create date time objects required
	df['DATEOFSERVICE'] = pd.to_datetime(df['DAYOFSERVICE'], format='%d-%b-%y %H:%M:%S').dt.date
	df = df.drop(columns=['DAYOFSERVICE'])
	df['HOUR'] = pd.to_datetime(df['ACTUALTIME_ARR'], unit='s').dt.hour
	df['ARR_DATETIME'] = pd.to_datetime(df['ACTUALTIME_ARR'], unit='s').dt.time
	df['ARR_DATETIME'] = df.apply(lambda df : pd.datetime.combine(df['DATEOFSERVICE'],df['ARR_DATETIME']),1)

	# Adjust dataframe
	df = df.drop_duplicates()
	df = df.sort_values(by=['TRIPID','ARR_DATETIME','PROGRNUMBER'], ascending=True)
	df = df.reset_index(drop=True)

	# Create segments, stop 1 departure time and target feature (journey time)
	df['STOPPOINTID'] = df['STOPPOINTID'].astype('str')
	seg_prev = df.shift()
	df["SEGMENT"] = None
	df["FIRSTSTOPARRIVAL"] = 0
	df["JOURNEYTIME"] = 0
	df.loc[df.PROGRNUMBER < 2, 'SEGMENT'] = "start"
	result = df.loc[(df.TRIPID == seg_prev.TRIPID) & (df.PROGRNUMBER > 1)]
	result['SEGMENT'] = seg_prev['STOPPOINTID'] + "_" + df['STOPPOINTID']
	result['FIRSTSTOPARRIVAL'] = seg_prev["ACTUALTIME_ARR"]
	result['JOURNEYTIME'] = df['ACTUALTIME_ARR'] - seg_prev["ACTUALTIME_ARR"]
	result['FIRSTSTOPARRIVAL'] = result['FIRSTSTOPARRIVAL'].astype('int32')
	result['JOURNEYTIME'] = result['JOURNEYTIME'].astype('int32')
	df.loc[(df.TRIPID == seg_prev.TRIPID) & (df.PROGRNUMBER > 1), ['SEGMENT', 'FIRSTSTOPARRIVAL','JOURNEYTIME']] = result
	df = df.drop(["ARR_DATETIME"], axis=1)
	del seg_prev
	# Return dataframe
	return df


def create_segments(df, path):

	# Create unique list of segments for given bus route
	segment_list = df.SEGMENT.unique()
	segment_list = segment_list[segment_list != "start"]
	segment_list = segment_list[segment_list != None]

	for segment in segment_list:
	        df_segment = df[df['SEGMENT'] == segment]
	        with open("segmentation_databases/" + segment + ".csv", 'a') as file:
	            df_segment.to_csv(file, header = False, index = False)
	            del df_segment



def process_all_routes(path, path_processed_routes, path_segments):

	for filename in os.listdir(path):
		print("File about to be processed is:", filename)

		routelist = [line.rstrip('\n') for line in open(path_processed_routes+'routes_processed.txt')]
		if filename not in routelist:

			dataframe = dataframe_transformation(filename, path)
			create_segments(dataframe, path)

			with open(path_processed_routes+'routes_processed.txt', 'a+') as f:
					f.write("%s\n" % filename)

process_all_routes(path, path_processed_routes, path_segments)
