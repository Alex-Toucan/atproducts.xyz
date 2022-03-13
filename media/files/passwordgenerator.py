import string, random
while True:
    characters = list(string.ascii_letters + string.digits)
    length = int(input("length: "))
    password = []
    
    for i in range(length): password.append(random.choice(characters))
    print("".join(password))