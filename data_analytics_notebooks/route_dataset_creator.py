#!/usr/bin/env python3

# Opens each file in order of name in the list
# For each route, filters the dataframe, appends to a file with the route name
# This is carried out for all data_chunks and routes
import pandas as pd
import numpy as np
path = 'data_splits/'

# SQL query to create three seperate dictionaries containing required features from rt_trips_DB_2018
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="Dublinbus",
  passwd="Dublinbus",
  database="Dublinbus",
    port=3306
)

mycursor = mydb.cursor()

mycursor.execute("SELECT tripid,lineid,routeid,direction FROM rt_trips_DB_2018")

myresult = mycursor.fetchall()

all_routes = []


for item in myresult:
    all_routes.append(item[1])
    
all_routes = set(all_routes)
all_routes = list(all_routes)


# Creates a list of file names for the bus routes
file_name_list = []
for name in range(1,117):
    file_name_list.append('chunk_data_' + str(name) + '.csv')

for name in file_name_list:
    
    df = pd.read_csv(path + name, sep=",")
    
    for route in all_routes:
        
        df_route = df[df['ROUTE'] == route]
        
        with open(path + 'route_data_files/' + route + '_dataset.csv', 'a') as file:
            df_route.to_csv(file, header = False)
