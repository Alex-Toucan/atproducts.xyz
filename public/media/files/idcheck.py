import datetime
id = int(input("id: "))
datetime.datetime.utcfromtimestamp(((id >> 22) + 1420070400000) / 1000)