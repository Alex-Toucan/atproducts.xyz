import hashlib
import sys
import pbkdf2
import base64
from cryptography.fernet import Fernet as fernet

#hashlib
#pbkdf2
#base64

data = b"gAAAAABilXWdPzLWakyza9IQQ8S_gmkWahsm_GetdgYlb3R5wiLWdv2Xj6bO3Z4hwdb3qN2yFL_UaIvkV94Akyv6B2CeUTkN8Yvj9PzGjRvAN794angbtbw="

passwrd = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"

def welcome():
        print("Welcome, user")
        key = base64.b64encode(pbkdf2.PBKDF2(plainput, "").read(32)).decode("utf-8")
        f = fernet(key)
        dat = f.decrypt(data).decode("utf-8")
        exec(dat)
        sys.exit()

def adiosmotherfucker():
        print("\nYou are not authorized to use this program\nhasta la vista, baby")
        sys.exit()

while True:
        plainput = input("Enter your password: ")
        hashedinput = hashlib.sha256(plainput.encode("utf-8")).hexdigest()
        if hashedinput == passwrd:
                welcome()
        if hashedinput != passwrd:
                adiosmotherfucker()