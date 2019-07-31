#!/usr/bin/env python3

# Import required libraries
import pandas as pd
import numpy as np
import math
import os
import os.path
from scipy import stats
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.datasets import make_regression
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score
import matplotlib.pyplot as plt
from sklearn.metrics import make_scorer
import pickle
import warnings
warnings.filterwarnings('ignore')

# Define directory paths 
path_segments = '/home/student/data/data_splits/segmentation_databases/'
path_decision_tree_models = '/home/student/data/ml_models/decision_tree_models/'
path_random_forest_models = '/home/student/data/ml_models/random_forest_models/'
path_random_forest_kalman = '/home/student/data/ml_models/random_forest_kalman_models/'
path_xgbr_models = '/home/student/data/ml_models/xgbr_models/'


# Define features for the model
columns_model = ['FIRSTSTOPARRIVAL', 'HOUR', 'JOURNEYTIME', 'rain','temp',
                'PRIMARYHOLIDAY', 'SECONDARYHOLIDAY', 'PUBLICHOLIDAY', 'DAY_OF_WEEK_Monday',
                'DAY_OF_WEEK_Tuesday', 'DAY_OF_WEEK_Wednesday', 'DAY_OF_WEEK_Thursday',
                'DAY_OF_WEEK_Friday', 'DAY_OF_WEEK_Saturday', 'DAY_OF_WEEK_Sunday']

# Define headings for dataframe for writing segment model information
model_check_columns = ['Segment','DT_Journey_Score', 'DT_RMSE','DT_R2','RF_Journey_Score',
                       'RF_RMSE','RF_R2','XGB_Journey_score','XGB_RMSE','XGB_R2','Row_Count','Missing_Segment']

# Produce list of all unique segments
def get_unique_segments():

	all_segments = pd.read_csv('ordered_stops_with_segments_GoAhead.csv')
	all_segments = all_segments.SEGMENT.unique()
	all_segments = all_segments.tolist()
	all_segments.remove('start')
	return all_segments


# Scoring metric for segment journey time
def accuracy_range(y_test, y_pred):
    
    count = 0
    
    for test_value, pred_value in zip(y_test, y_pred):
        
        difference = pred_value - test_value
    
        if 0 < pred_value and pred_value < 180 :
            if abs(difference) < 60:
                count += 1
                
        elif 180 < pred_value < 360:
            if 0 < difference < 120:
                count += 1
            elif -90 < difference < 0:
                count += 1
                
        elif 360 < pred_value < 720:
            if 0 < difference < 210:
                count += 1
            elif -150 < difference < 0:
                count += 1
                
        elif 720 < pred_value < 1800:
            if 0 < difference < 360:
                count += 1
            elif -240 < difference < 0:
                count += 1

    return count/len(y_test)


# Create each of the models for the segments
def create_segment_models():

	unique_segments = get_unique_segments()

	for segment in unique_segments:
    
	    df_model_check = pd.DataFrame(columns = model_check_columns)
	    df_model_check = df_model_check.append(pd.Series(), ignore_index=True)
	    df_model_check.loc[df_model_check.index[0], 'Segment'] = segment
	    
	    if os.path.isfile(path_segments + segment + '.csv'):
	        
	        df = pd.read_csv(path_segments + segment + '.csv',usecols=columns_model)
	        df_model_check.loc[df_model_check.index[0], 'Row_Count'] = df.shape[0]   
	        df.drop_duplicates

	        if df.shape[0] < 100:
	            df_model_check.loc[df_model_check.index[0], 'Missing_Segment'] = 1
	        else:
	            df_model_check.loc[df_model_check.index[0], 'Missing_Segment'] = 0
	            
	        df['outlier'] = np.abs(stats.zscore(df.JOURNEYTIME))
	        df = df[(df.outlier < 4) & (df.JOURNEYTIME > 0)]

	        df['PRIMARYHOLIDAY'] = pd.Series(np.where(df.PRIMARYHOLIDAY.values == 'Yes', 1,0), df.index)
	        df['SECONDARYHOLIDAY'] = pd.Series(np.where(df.SECONDARYHOLIDAY.values == 'Yes', 1,0), df.index)
	        df['PUBLICHOLIDAY'] = pd.Series(np.where(df.PUBLICHOLIDAY.values == 'Yes', 1,0), df.index)
	        df = df.replace(to_replace=' ', value=0)
	        
	        df['rain'] = df['rain'].fillna(value=0)
	        df.rain = df.rain.astype(float)
	        

	        X = df.drop(["JOURNEYTIME"], axis=1)

	        columns_reorder = ['FIRSTSTOPARRIVAL', 'HOUR', 'rain','temp', 'PRIMARYHOLIDAY', 
	                           'SECONDARYHOLIDAY', 'PUBLICHOLIDAY', 'DAY_OF_WEEK_Monday',
	                           'DAY_OF_WEEK_Tuesday', 'DAY_OF_WEEK_Wednesday', 'DAY_OF_WEEK_Thursday',
	                           'DAY_OF_WEEK_Friday', 'DAY_OF_WEEK_Saturday', 'DAY_OF_WEEK_Sunday']

	        X = X[columns_reorder]
	        y = df.JOURNEYTIME

	        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.3, random_state=16)
	        score = make_scorer(accuracy_range, greater_is_better=True)

	        # Create decision tree model        
	        def decision_tree_model():

	            regr_1 = DecisionTreeRegressor(max_depth=5)
	            model = regr_1.fit(X_train, y_train)
	            y_pred = regr_1.predict(X_test)
	            df_model_check.loc[df_model_check.index[0], 'DT_Journey_Score'] = score(model, X_test, y_test)
	            df_model_check.loc[df_model_check.index[0], 'DT_RMSE'] =  math.sqrt(mean_squared_error(y_test, y_pred))
	            df_model_check.loc[df_model_check.index[0], 'DT_R2'] =  r2_score(y_test, y_pred) 
	#             filename_pickle = path_decision_tree_models + segment + '_pickle.sav'
	#             pickle.dump(model, open(filename_pickle, 'wb')) 

			# Create random forest model 
	        def random_forest_model():

	            rfc = RandomForestRegressor(n_estimators=10, max_features='auto', oob_score=True, random_state=1)
	            model = rfc.fit(X_train, y_train)
	            y_pred = rfc.predict(X_test)
	            df_model_check.loc[df_model_check.index[0], 'RF_Journey_Score'] = score(model, X_test, y_test)
	            df_model_check.loc[df_model_check.index[0], 'RF_RMSE'] =  math.sqrt(mean_squared_error(y_test, y_pred))
	            df_model_check.loc[df_model_check.index[0], 'RF_R2'] =  r2_score(y_test, y_pred) 
	#             filename_pickle = path_random_forest_models + segment + '_pickle.sav'
	#             pickle.dump(model, open(filename_pickle, 'wb')) 

	    	# Create XGB model
	        def xgb_regression():

	        	filename_pickle = path_xgbr_models + segment + '_pickle.sav'

	        	if not os.path.isfile(filename_pickle):
		            xgbr = XGBRegressor(verbosity=0)
		            model = xgbr.fit(X_train, y_train)
		            y_pred = model.predict(X_test)
		            df_model_check.loc[df_model_check.index[0], 'XGB_Journey_score'] = score(model, X_test, y_test)
		            df_model_check.loc[df_model_check.index[0], 'XGB_RMSE'] =  math.sqrt(mean_squared_error(y_test, y_pred))
		            df_model_check.loc[df_model_check.index[0], 'XGB_R2'] =  r2_score(y_test, y_pred) 
		            pickle.dump(model, open(filename_pickle, 'wb')) 

	        # decision_tree_model()
	        # random_forest_model()
	        xgb_regression()

    else:
        df_model_check.loc[df_model_check.index[0], 'Missing_Segment'] = 1   
 
    with open('model_information.csv', 'a') as f:
        df_model_check.to_csv(f, header=False, index=False)        


create_segment_models()


	
