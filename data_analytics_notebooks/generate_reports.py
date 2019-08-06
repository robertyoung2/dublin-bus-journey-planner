#!/usr/bin/env python3

# Script that auto generates data quality report for each bus route dataset

import numpy as np
import pandas as pd
import os
import pandas_profiling
import matplotlib.font_manager
import warnings
warnings.filterwarnings('ignore')


path = '/home/student/data/data_splits/route_data_files/'

columns_to_load = ['DAYOFSERVICE','TRIPID','PROGRNUMBER','STOPPOINTID'
                   ,'ACTUALTIME_ARR','ACTUALTIME_DEP','ROUTEID','DIRECTION']

for filename in os.listdir(path):
    if filename[-4:] == '.csv':
      df = pd.read_csv(path+filename, usecols= columns_to_load, dtype =
                       {"PROGRNUMBER":np.int16, "STOPPOINTID":np.int16, "TRIPID":np.int32,
                        "ACTUALTIME_ARR":np.int32, "ACTUALTIME_DEP":np.int32, "DIRECTION":np.int8,})
      profile = df.profile_report(title= filename[:-4] + '_data_report')
      profile.to_file(output_file= path+'/data_quality_reports/'+filename[:-4] + '_data_report' + ".html")
      del profile
      del df


