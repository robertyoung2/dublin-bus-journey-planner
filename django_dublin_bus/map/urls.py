from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='map-home'),
    path('get_routes', views.get_routes, name='get_routes'),
    path('run_model', views.run_model, name='run_model')
]
