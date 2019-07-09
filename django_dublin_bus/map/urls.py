from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='map-home'),
    path('get_routes', views.get_routes, name='get_routes')
]
