import unittest
from django.test import Client
from django.urls import reverse

class MapUnitTesting(unittest.TestCase):

    # Set up the client
    def setUp(self):
        self.client = Client()

    def test_details(self):
        # Issue a GET request.
        url = reverse("map-home")
        response = self.client.get(url)

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)

        # Check that the rendered context returns all stops from databse.
        self.assertEqual(len(response.context['bus_stops']), 4232)

    











