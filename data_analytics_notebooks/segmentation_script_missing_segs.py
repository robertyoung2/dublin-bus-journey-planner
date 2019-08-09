#!/usr/bin/env python3

# Import required libraries
import pandas as pd
import numpy as np
import os

path = '/home/student/data/data_splits/route_datasets_refined/'
path_segments = '/home/student/data/data_splits/route_data_files/segmentation_databases/'
path_processed_routes = '/home/student/data/data_splits/'

missing_segment_files = ['278_10.csv', '793_320.csv', '33_7270.csv', '7270_6122.csv', '1354_7578.csv', '496_497.csv', '522_523.csv',
 '299_497.csv', '5171_2976.csv', '278_8.csv', '2236_2238.csv', '315_406.csv', '4888_4798.csv', '4798_4715.csv',
 '7510_2207.csv', '496_515.csv', '3814_3815.csv', '315_404.csv', '793_274.csv', '6059_404.csv', '4848_4350.csv',
 '792_7586.csv', '1363_1365.csv', '1365_1365.csv', '274_1505.csv', '7591_496.csv', '319_274.csv', '3129_3130.csv',
 '2166_4554.csv', '7698_7113.csv', '819_4725.csv', '4725_334.csv', '792_320.csv', '322_7697.csv', '791_7585.csv',
 '300_497.csv', '324_1634.csv', '1179_5060.csv', '496_523.csv', '621_4495.csv', '909_790.csv', '790_7585.csv',
 '496_522.csv', '522_1741.csv', '7623_3719.csv', '3744_3715.csv', '3715_3755.csv', '4362_7025.csv', '7160_7700.csv',
 '7700_7047.csv', '7048_7699.csv', '7699_7159.csv', '7473_2679.csv', '2679_4691.csv', '2678_2681.csv', '2681_2680.csv',
 '4905_4906.csv', '3689_3690.csv', '1184_497.csv', '6115_1205.csv', '6074_793.csv', '793_495.csv', '5142_7567.csv',
 '459_2080.csv', '2574_2577.csv', '7270_7266.csv', '3968_7771.csv', '7771_3966.csv', '3982_7704.csv', '7704_3983.csv',
 '1989_1472.csv', '1981_4406.csv', '324_1555.csv', '1552_332.csv', '3128_3130.csv', '3164_3079.csv', '4319_1476.csv',
 '7453_2001.csv', '1359_4724.csv', '4724_263.csv', '263_4508.csv', '4508_7402.csv', '7402_4717.csv', '4717_2499.csv',
 '7216_2501.csv', '7623_7401.csv', '7401_3665.csv', '3665_7400.csv', '7400_3669.csv', '3669_7399.csv', '7399_7611.csv',
 '7611_7398.csv', '7397_5140.csv', '5140_620.csv', '620_1172.csv', '1172_286.csv', '271_4521.csv', '1935_1445.csv',
 '1445_4319.csv', '6074_748.csv', '749_494.csv', '495_7588.csv', '7588_4717.csv', '3669_7611.csv', '2809_7612.csv',
 '7612_2811.csv', '2811_842.csv', '842_1014.csv', '1014_1015.csv', '1015_1074.csv', '1546_7560.csv', '7559_7073.csv',
 '5144_7702.csv', '7702_7009.csv', '7677_7559.csv', '7559_7107.csv', '7678_7560.csv', '7560_7679.csv', '7681_7738.csv',
 '7738_7683.csv', '1600_7701.csv', '7701_7010.csv', '7010_7703.csv', '7703_5147.csv', '6311_4495.csv', '4569_4570.csv',
 '6247_2679.csv', '3434_3453.csv', '3077_3079.csv', '4569_2023.csv', '3144_7639.csv', '3164_7188.csv', '3135_7363.csv',
 '909_792.csv']

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
	result = df.loc[(df.TRIPID == seg_prev.TRIPID) & (df.PROGRNUMBER - seg_prev.PROGRNUMBER == 2)]
	result['SEGMENT'] = seg_prev['STOPPOINTID'] + "_" + df['STOPPOINTID']
	result['FIRSTSTOPARRIVAL'] = seg_prev["ACTUALTIME_ARR"]
	result['JOURNEYTIME'] = df['ACTUALTIME_ARR'] - seg_prev["ACTUALTIME_ARR"]
	result['FIRSTSTOPARRIVAL'] = result['FIRSTSTOPARRIVAL'].astype('int32')
	result['JOURNEYTIME'] = result['JOURNEYTIME'].astype('int32')
	df.loc[(df.TRIPID == seg_prev.TRIPID) & (df.PROGRNUMBER - seg_prev.PROGRNUMBER == 2), ['SEGMENT', 'FIRSTSTOPARRIVAL','JOURNEYTIME']] = result
	df = df.drop(["ARR_DATETIME"], axis=1)
	del seg_prev
	# Return dataframe
	return df


def create_segments(df, missing_segment_files):

	# Create unique list of segments for given bus route
	segment_list = df.SEGMENT.unique()
	segment_list = segment_list[segment_list != "start"]
	segment_list = segment_list[segment_list != None]

	for segment in segment_list:
		if (segment + ".csv") in missing_segment_files:
			df_segment = df[df['SEGMENT'] == segment]
			if len(df_segment) > 40:
				with open("segmentation_databases/" + segment + ".csv", 'a') as file:
					df_segment.to_csv(file, header = False, index = False)
					del df_segment


def process_all_routes(path, path_processed_routes, missing_segment_files):

	for filename in os.listdir(path):
		print("File about to be processed is:", filename)

		routelist = [line.rstrip('\n') for line in open(path_processed_routes+'routes_processed.txt')]
		if filename not in routelist:

			dataframe = dataframe_transformation(filename, path)
			create_segments(dataframe, missing_segment_files)

			with open(path_processed_routes+'routes_processed.txt', 'a+') as f:
					f.write("%s\n" % filename)


process_all_routes(path, path_processed_routes, missing_segment_files)
