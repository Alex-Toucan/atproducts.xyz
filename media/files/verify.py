import time, requests

input("\nClassic Discord Nitro Checker by nasus\nTool will be slow due to ratelimits | Make sure there are codes in your codes.txt file\n")
while True:
    with open("codes.txt") as f:
        code = f.readline().rstrip()
    url = requests.get(f"https://discordapp.com/api/v9/entitlements/gift-codes/{code}?with_application=false&with_subscription_plan=true")
    if url.status_code == 200:
        quit(f"[Valid] {code}")
    elif url.status_code == 404:
        print(f"[Invalid] Code | {code}")
        with open('codes.txt', 'r') as f:
            data = f.read().splitlines(True)
        with open('codes.txt', 'w') as t:
            t.writelines(data[1:])
    elif url.status_code == 429:
        rate = int(url.json()['retry_after']) + 1
        print(f"Ratelimited! {round(rate, 2)}s")
        time.sleep(rate)