from selenium import webdriver
from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import render, get_object_or_404, get_list_or_404, redirect
from django.http import HttpResponse, HttpResponseRedirect, Http404, HttpResponseBadRequest
from django.urls import reverse
from django.views import generic
from django.core import serializers
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector, TrigramSimilarity
from django.db import migrations
from django.contrib.postgres.operations import TrigramExtension
from django.db.models import Q, Count, Sum
from itertools import chain
from django.contrib.sites.shortcuts import get_current_site# Get all the tags from a json response
from django.conf import settings
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.contrib.auth import login, authenticate
from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm
import pandas as pd
from pandas.io.json import json_normalize
from django.core.mail import EmailMessage
import json as json_lib
import urllib
import xml.dom.minidom as minidom
import ast
import re
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5, AES
from Crypto.Hash import SHA
from Crypto import Random
from background_task.models import Task
from django.utils.crypto import get_random_string
from datetime import datetime
from django.utils import six
from core.models import GeneralTestDetails, Vendor, API, Endpoint, Parameter, Request, Response, Rule, ResponseRule,EndpointTag, License, VendorLicense, \
    EndpointScan, VendorCompliance, TemporaryEndpointTable, Profile, UserLimitation, ViewedProject, ViewedLicense, ViewedVendorLicense, TagDic, Authentication, \
    APIBasicAuthKey, ConsolePicture, Category, ApiRecom, Organization, Organization_User, OrganizationInvitation, OrganizationProfile, OrganizationLimitation, \
    VendorCredential
from django.contrib.auth.models import User
from core.auth import AuthHandler
from core.forms import RequestForm, RuleForm, URLScanForm, SignupForm, OrganizationInviteForm, OrgUserSignupForm, OrganizationSignupForm, OrganizationSuperUser, \
    ApiRecomForm, VendorForm, APIForm, EndpointForm, ParameterForm, ParameterFormSet, VendorLicenseFormSet
from core import tasks
from core.rules import delete_rule
from core.utils import get_fpath, getvar, response_format, get_categories
from core.tos import TosRuleBasedAnalyzer
from core.api_recom import endpoint_recommandor
from core.tokens import account_activation_token
from core.tables import sorting, pagination
'''from background_task import background
from django.utils import timezone
from core.background.api_requests import automate_calls'''
import time
import stripe
import socket
import logging
import asyncio
logger = logging.getLogger('core')
import operator
from operator import itemgetter
from django.contrib import messages
from django.utils.translation import ugettext as _
from wsgiref.util import FileWrapper
from db_file_storage.storage import DatabaseFileStorage

def entry(request,env=None): 
    if not request.user.is_staff:
        return render(request, 'core/testWen.html',{"tmp2":"you are not a staff here"})
    chrome_options= webdriver.ChromeOptions()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('window-size=1920x3000') #set the resolution of the browser
    chrome_options.add_argument('--disable-gpu') #to reduce bug
    chrome_options.add_argument('--hide-scrollbars') #hide the scrollbar
    chrome_options.add_argument('blink-settings=imagesEnabled=false') #disable the loading of the image
    chrome_options.add_argument('--headless') #without this ,in the linux environment error could be thrown

    result=list()
    response = HttpResponse(content_type="text/plain")
    response['Content-Disposition'] = 'attachment; filename=selenium.txt'

    driver = webdriver.Chrome(chrome_options=chrome_options)
    driver.maximize_window()
    driver.get('https://dev.teejlab.com/edsn/')
    time.sleep(1)

    response.write("###### SELENIUM TEST REPORT <ON DEV> ####### \n \n")
    response.write("<------- Sign-in part  --------> \n")

    try:
        signIn_info=driver.find_element_by_xpath("//div[contains(text(),'Sign In')]") 
        result.append("sign-in page shows successfully")
        response.write("sign-in page shows successfully \n")
    except:
        result.append("sign-in page didnt show")
        response.write("sign-in page didnt show \n")
        return response

    try:
        username_sel0=driver.find_element_by_xpath("//input[@name='username']")
        password_sel0=driver.find_element_by_xpath("//input[@name='password']")
        username_sel0.send_keys("selenium_test")
        password_sel0.send_keys("S123456@")
    except:
        result.append("username or password could not be typed in successfully")
        response.write("username or password could not be typed in successfully \n")
        return response
    else:
        submit_sel0 = driver.find_element_by_xpath("//input[@type='submit']")
        submit_sel0.click()
        time.sleep(1)
        result.append("username and password were typed in successfully")
        response.write("username and password were typed in successfully \n")
    try:
        driver.find_element_by_id("traceback")
        response.write("[ERROR] after clicking the log-in button, get an error \n")
        return response
    except:
        print ("do nothing")    

    # test the search function
    search_bar=driver.find_element_by_name("q")
    if not search_bar:
        response.write("log-in failed \n")
        response.write("<------- [Failed] Sign-in part  --------> \n")
        return response
    
    response.write("<------- [Success] Sign-in part  --------> \n \n")
    response.write("<------- Home Page Search Function  --------> \n")

    search_bar.send_keys("book")
    submit_button = driver.find_element_by_xpath("//button[@type='submit']")
    submit_button.click()
    time.sleep(1)
    title_api=driver.find_element_by_xpath("//h4[contains(text(),'API Search Results')]") 
    if title_api:
        response.write("API Search Results Page displayed successfully \n")
    else:
        response.write("[ERROR] API Search Results Page could not display \n")
        response.write("<-------[Failed] Home Page Search Function  --------> \n")
        return response

    response.write("<-------[Success] Home Page Search Function  --------> \n \n")
    # Text file  
    response.write("###### TEST DONE ###### \n")
    return response
