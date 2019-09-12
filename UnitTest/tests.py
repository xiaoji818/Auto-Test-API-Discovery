# Copyright 2018 TeejLab Inc. All Rights Reserved. 
#
# Unauthorized copying of this file via any medium is strictly prohibited. 
# Proprietary and confidential. 
#
# Punit Shah <punit.shah@teejlab.com>, February 2018. 
# Edited by Zhuoli, March 2018

from django.test import TestCase

from core.models import API, Endpoint, Parameter, Authentication, Response 
from core.views import RequestHandler

from scripts.insert_vendor_twitter import run as insert_vendor
from scripts.insert_api_twitter_search import run as insert_api

# Create your tests here.


class EndpointRequestTests(TestCase):

	def test_request_handler_execution(self):

		insert_vendor() 
		insert_api() 

		endpoint = Endpoint.objects.filter(endpoint='https://api.twitter.com/1.1/search/tweets.json',
			method='get').first()
		specs = Parameter.objects.filter(endpoint=endpoint.id) 
		parameters = {
			'q': 'artificial intelligence',
		}
		handler = RequestHandler(endpoint, specs, parameters) 

		handler._authorize() 
		self.assertTrue('Authorization' in handler.header)
		self.assertTrue("Bearer" in handler.header['Authorization'])

		handler._sort_parameters() 
		self.assertTrue('q' in handler.query) 

		handler._execute() 
		self.assertTrue(handler.response is not None) 

		handler._parse_response()
		self.assertTrue(isinstance(handler.response_as_json, dict))

		response_id = handler.save_response()
		self.assertTrue(Response.objects.filter(pk=response_id).exists())


