import requests
import string
import re
from bs4 import BeautifulSoup
import csv
import json
import os
import time
import fnmatch
import re
import random
import unidecode

##################################################
# RUN ./season-leaders.py BEFORE RUNNING THIS FILE
##################################################

FILE='player-info.json'
with open(FILE, encoding="utf8") as data:    
    players = json.load(data)

FILE='season-leaders.json'
with open(FILE, encoding="utf8") as data:    
    leaderboards = json.load(data)

###############################################################
############# Calculates amount each player's price should rise
###############################################################

dictionary = {}

for board in leaderboards:
    count = 1
    for name in board["leaders"]:
        if name in dictionary.keys():
            dictionary[name].append(count)
        else:
            dictionary[name] = [count]
        count += 1

for key, value in dictionary.items():
    add = 0
    for place in value:
        add += (1-(place * 0.05))
    print(key, add)
    dictionary[key] = add

###############################################################
###############################################################
###############################################################


leaders = [{"key": i, "player": unidecode.unidecode(i)} for i in dictionary.keys()]
x = [{"name": i["player"], "add": dictionary[i["key"]]} for i in leaders]
for item in x:
    for player in players:
        if unidecode.unidecode(player["name"]).replace(' Jr.','') == item["name"]:
            player["price"]["4"] = player["price"]["3"] + item["add"]
            
for player in players:
    if "4" not in player["price"].keys():
        player["price"]["4"] = player["price"]["3"]

print(players)

handle = open("player-info.json", "w", encoding="utf8")
json.dump(players, handle, indent=6, ensure_ascii=False)
handle.close()
