import string, random

f = open("codes.txt", "a")
input("Codes will be stored in codes.txt Press enter to activate\n")
amount = 0

while True:
  code = ''.join([random.choice(string.ascii_letters + string.digits) for i in range(16)])
  amount += 1
  print(f"{amount} : {code}")
  f.write(f"{code}\n")