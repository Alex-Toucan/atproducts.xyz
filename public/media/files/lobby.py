from threading import Thread
from kahoot import client

bot_count = int(input("number of bots: "))
game_pin = int(input("game pin: "))

def create_bot(name):
    bot = client()
    bot.join(game_pin, name)
for i in range(bot_count): 
    Thread(target=create_bot(str(i))).start()
quit()