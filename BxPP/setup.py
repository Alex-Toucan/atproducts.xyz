from progress.bar import Bar
import os, sys, time
from urllib.request import *
import urllib.request
import requests

#Checks for internet connection.
def connect(host='https://google.com'):
    try:
        urllib.request.urlopen(host) #Python 3.x
        return True
    except:
        return False

#Updator
def updaterv2():
  try:
    os.system('rm -r /usr/bin/BxPP')
    os.system('rm setup.py')
    os.system('rm update.key')
    with urlopen('https://atproducts.xyz/bxpp/update.key') as webpagee: 
            contentt = webpagee.read().decode() 
            with open('update.key', 'w') as f: 
              f.write(contentt) 
              f.close()
    with urlopen('https://atproducts.xyz/bxpp/BxPP.py') as webpage:
            content = webpage.read().decode()
            with open('BxPP.py', 'w') as f:
              f.write(content)
              f.close()
    return True
  except:
    return False
#Really rushed system here LOL
def update():
  try:
    with urlopen('https://atproducts.xyz/bxpp/update.key') as webpage: 
            content = webpage.read().decode() 
            with open('update.key', 'w') as f: 
              f.write(content) 
              f.close()
              return True
  except:
        return False
        
def install():
    try:
      with urlopen('https://atproducts.xyz/bxpp/setup.py') as webpage:
        content = webpage.read().decode()
        with open('setup.py', 'w') as f:
          f.write(content)
          f.close()
          return True
    except:
        return False


#Checking internet connection
with Bar('Checking internet connection.', max=2000) as bar:
    if connect():
      for i in range(2000):
        # Do some work
        bar.next()
    else:
      sys.exit('Need internet connection!')


#Installer for BxPP	
with Bar('Installing', max=2000) as bar:
    if install():
      for i in range(2000):
        bar.next()
    else:
      sys.exit('Failed to find file.')


with Bar('Checking for update', max=2000) as bar:
    if update():
      for i in range(2000):
        bar.next()
    else:
      sys.exit('Failed to check!')

print("Update found do you want to update??? (y/n)")
while True:
  option = input("+=+ ")
  if option =='y':
    break
  else:
    sys.exit('Install finished!')

with Bar('Installing update', max=2000) as bar:
  if updaterv2():
    for i in range(2000):
      bar.next()
  else:
    sys.exit('Failed to update -try reloading or check network connection!-')
    
  
os.system('sudo alias BxPP="/usr/bin/BxPP/BxPP.py > ~/.bashrc"')
os.system('sudo source ~/.bashrc')
print("Setup finished!")
