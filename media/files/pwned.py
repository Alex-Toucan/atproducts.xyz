import hashlib, requests, os
from getpass import getpass


def pwn(password, hashed_password):
    r = requests.get(f'https://api.pwnedpasswords.com/range/{password}', verify=True)
    pwnd = r.text.split("\r\n")
    for data in pwnd:
        if data[0:35] == hashed_password.upper():
            return(input(f'\nOh no - pwned!\nThis password has been seen {data[36:]} times before\n'))

    return(input("\nGood news - no pwnage found!\n"))

while True:
    os.system('cls' if os.name == 'nt' else 'clear')
    # get password
    password = getpass("\n';--have i been pwned?: ")
    encode = hashlib.sha256(password.encode())
    salt = os.urandom(16)
    hashed_password = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    pwnd_password = hashlib.sha256(password.encode()).hexdigest()[0:5]
    
    pwn(pwnd_password, hashed_password.hex()[5:])
