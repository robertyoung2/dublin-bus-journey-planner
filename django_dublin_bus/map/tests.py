import unittest
from django.test import Client
from django.urls import reverse
from map.views import round_to_hour, distance, closest
import datetime
import json
import ast


class MapUnitTesting(unittest.TestCase):

    # Set up the client
    def setUp(self):
        self.client = Client()

    def test_home_view(self):
        # Issue a GET request.
        url = reverse("map-home")
        response = self.client.get(url)

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)

        # Check that the rendered context returns all stops from database.
        self.assertEqual(len(response.context['bus_stops']), 4732)

    # def test_get_routes(self):
    #
    #     data = {'stop_id': "8220B007612"}
    #     response = self.client.post(reverse('get_routes'), data)
    #     json_content = json.loads(response.content)
    #     self.assertEqual((json_content[0]['fields']['bus_numbers']), "757")
    #     self.assertEqual((json_content[0]['fields']['stop_headsign']), "Charlotte Way")


    def test_round_to_hour(self):

        round_down = datetime.datetime.strptime("2019-08-16 16:29:19", '%Y-%m-%d %H:%M:%S')
        middle_round = datetime.datetime.strptime("2019-08-16 16:30:00", '%Y-%m-%d %H:%M:%S')
        round_up = datetime.datetime.strptime("2019-08-16 16:31:19", '%Y-%m-%d %H:%M:%S')
        no_round = datetime.datetime.strptime("2019-08-16 18:00:00", '%Y-%m-%d %H:%M:%S')
        answer_down = datetime.datetime.strptime("2019-08-16 16:00:00", '%Y-%m-%d %H:%M:%S')
        answer_middle = datetime.datetime.strptime("2019-08-16 17:0:00", '%Y-%m-%d %H:%M:%S')
        answer_up = datetime.datetime.strptime("2019-08-16 17:00:00", '%Y-%m-%d %H:%M:%S')
        answer_no_round = datetime.datetime.strptime("2019-08-16 18:00:00", '%Y-%m-%d %H:%M:%S')

        self.assertEquals(round_to_hour(round_down), answer_down)
        self.assertEquals(round_to_hour(middle_round), answer_middle)
        self.assertEquals(round_to_hour(round_up), answer_up)
        self.assertEquals(round_to_hour(no_round), answer_no_round)

    def test_distance(self):

        dublin_coords = [53.328430, -6.304864]
        cork_coords = [51.903614, -8.468399]
        distance_km = 215.47

        self.assertAlmostEqual(distance(dublin_coords[0], dublin_coords[1], cork_coords[0],
                                        cork_coords[1]), distance_km, 2)


    # def test_closest(self):
    #