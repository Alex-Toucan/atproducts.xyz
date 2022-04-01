import hashlib, requests, os


def pwn(password, hashed_password):
    r = requests.get(f'https://api.pwnedpasswords.com/range/{password}')
    pwnd = r.text.split("\r\n")
    for data in pwnd:
        if data[0:35] == hashed_password.upper():
            return(input(f'\nOh no - pwned!\nThis password has been seen {data[36:]} times before\n'))

    return(input("\nGood news - no pwnage found!\n"))

while True:
    os.system('cls' if os.name == 'nt' else 'clear')
    # get password
    password = input("\n';--have i been pwned?: ")
    encode = hashlib.sha1(password.encode())
    hashed_password = encode.hexdigest()
    pwnd_password = hashed_password[0:5]
    
    pwn(pwnd_password, hashed_password[5:])
