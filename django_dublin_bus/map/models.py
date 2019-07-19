# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class BusStops(models.Model):
    stop_id = models.TextField()
    bus_numbers = models.TextField()
    stop_headsign = models.TextField()


class StopsInfo(models.Model):
    stop_lat = models.FloatField()
    stop_lng = models.FloatField()
    stop_id = models.TextField()
    actual_stop_id = models.IntegerField()
    stop_name = models.TextField()
    routes = models.ManyToManyField('BusStops')


class Holidays(models.Model):
    date = models.DateField()
    public_holiday = models.BooleanField(default=False)
    primary_holiday = models.BooleanField(default=False)
    secondary_holiday = models.BooleanField(default=False)
