#!/usr/bin/env python3

# Script that reduces the size of the routes datasets by only keeping features we know we neec

import pandas as pd
import numpy as np
import os

path = '/home/student/data/data_splits/route_data_files/'
path_new_datasets = '/home/student/data/data_splits/route_datasets_refined/'

already_created = []
for filename in os.listdir(path_new_datasets):
    already_created.append(filename)

for filename in os.listdir(path):

	if filename[:-4] + "_refined.csv" not in already_created:
		columns_to_load = ['DAYOFSERVICE','PROGRNUMBER','STOPPOINTID', 'PLANNEDTIME_ARR', 'PLANNEDTIME_DEP','ACTUALTIME_ARR','ACTUALTIME_DEP', 'ROUTEID','TRIPID']
		dtypes= {"PROGRNUMBER":np.int16, "STOPPOINTID":np.int16, "PLANNEDTIMED_ARR":np.int32, "TRIPID":np.int32, "PLANNEDTIMED_DEP":np.int32, "ACTUALTIME_ARR":np.int32, "ACTUALTIME_DEP":np.int32}
		df_chunk = pd.read_csv(path+filename, chunksize=100000, usecols= columns_to_load, dtype = dtypes, engine='python')
		write_header = True
		for data_trips in df_chunk:
			with open(path_new_datasets+filename[:-4]+ "_refined.csv", 'a') as file_append:
				data_trips.to_csv(file_append, header=write_header, index = False ) 
				file_append.close()
				write_header = False