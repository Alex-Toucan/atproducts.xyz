import string, random, hashlib

while True:
    characters = list(string.ascii_letters + string.digits)
    length = int(input("length: "))
    password = []

    for i in range(length):
        password.append(random.choice(characters))

    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    hashed_password = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), salt, 100000)
    hashed_password = binascii.hexlify(hashed_password)

    print(hashed_password)
