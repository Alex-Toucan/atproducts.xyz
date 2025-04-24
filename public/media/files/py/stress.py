import sys
import subprocess

if sys.platform != "linux":
    print("[-] You need a Linux system")
    print("Windows is coming soon")
    exit()

site = input("Enter the site you want to test: ")
if not site.startswith("http"):
    print("[-] Site has to start with 'http://' or 'https://'")
    exit()

try:
    out = subprocess.check_output(["ab", "-n", "1000", "-c", "10", "-k", "-H", "Accept-Encoding: gzip, deflate", site])
except FileNotFoundError:
    print("You have to install httpd-tools: 'sudo apt-get install apache2-utils'")
    exit()
except Exception as e:
    print(f"[-] Unknown error: {e}")
    exit()

try:
    splitted1 = out.split(b"Requests per second:    ")[1]
except IndexError:
    print("[-] Couldn't find 'Requests per second:' in the output")
    exit()

splitted2 = splitted1.split(b" [#/sec]")[0]
print(f"The site can handle: {splitted2.decode('utf-8')} users per second.")
