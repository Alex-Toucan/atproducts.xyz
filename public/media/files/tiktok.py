import requests

username = input("Enter TikTok username: ")
response = requests.get(f"https://www.tiktok.com/@{username}")
if response.status_code == 200:
    print("+")
else:
    print("-")
