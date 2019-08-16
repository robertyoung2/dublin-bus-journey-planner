import unittest
from django.test import Client
from django.urls import reverse
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
        self.assertEqual(len(response.context['bus_stops']), 4232)

    def test_get_routes(self):

        data = {'stop_id': "8220B007612"}
        response = self.client.post(reverse('get_routes'), data)
        json_content = json.loads(response.content)
        self.assertEqual((json_content[0]['fields']['bus_numbers']), "757")
        self.assertEqual((json_content[0]['fields']['stop_headsign']), "Charlotte Way")


    def test_round_hour(self):
        round_down = "2019-08-16 16:29:19"
        round_up = "2019-08-16 16:31:19"

        
        answer_up = "2019-08-16 17:00:00"























