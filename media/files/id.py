import urllib.request as ur
import json as j

gameid = input("game id: ")
url = "https://play.kahoot.it/rest/kahoots/" + gameid
f = j.loads(ur.urlopen(url).read())["questions"]
colours = ["red", "blue", "yellow", "green"]

for index, slide in enumerate(f):
    for i in range(len(slide.get("choices"))):
        if slide["choices"][i]["correct"]:
            colours_list = colours[:2][::-1] if len(slide.get("choices")) == 2 else colours
            print(f"{index+1}:\n{slide['choices'][i].get('answer')}\n{colours_list[i]}\n")