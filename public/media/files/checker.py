import requests
a = input("Enter the website to check: ")
if a.startswith("http"):
    res = requests.get(a)
    if int(res.status_code) == 404:
        print("Website available!")
    elif int(res.status_code) == 200:
        print("Website not available!")
    else:
        print("Unknown Error (Internet)! ")
else:
   # print("Website has to beginn with 'http://' or 'https://'")
    site = "https://" + a
    res = requests.get(site)
    if int(res.status_code) == 404:
        print("Website available!")
    elif int(res.status_code) == 200:
        print("Website not available!")
    else:
        print("Unknown Error (Internet)! ")
