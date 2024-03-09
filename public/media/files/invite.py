import time, requests, string, random, json

input("Press Enter to start\n")
while True:
    code = ''.join([random.choice(string.ascii_letters + string.digits) for i in range(6)])    
    url = requests.get(f"https://canary.discord.com/api/v6/invite/{code}&with_counts=True", timeout=3)
    if url.status_code == 200:
        jurl = url.json()
        ginfo = jurl["guild"]
        gname = ginfo["name"]
        members = jurl["approximate_member_count"]
        print(f"{gname}: discord.gg/{code} | {members} Members")
    elif url.status_code == 404:
        continue
    elif url.status_code == 429:
        rate = int(url.json()['retry_after']) + 1
        print(f"\nRatelimited! {round(rate, 2)}\n")
        time.sleep(rate)
