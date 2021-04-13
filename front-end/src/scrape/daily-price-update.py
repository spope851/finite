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
import pprint

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
            dictionary[name].append({ board["stat"] : count })
        else:
            dictionary[name] = [{ board["stat"] : count }]
        count += 1

#pprint.pprint(dictionary)

for key, value in dictionary.items():
    #print(key, value)
    add = 0
    for place in value:
        add += (1-(list(place.values())[0] * 0.05))
    print(key, add)
    dictionary[key] = { "add": add, "value": value }

###############################################################
###############################################################
###############################################################

#pprint.pprint(dictionary)

leaders = [{"key": i, "player": unidecode.unidecode(i)} for i in dictionary.keys()]
x = [{"name": i["player"], "add": dictionary[i["key"]]["add"], "value": dictionary[i["key"]]["value"]} for i in leaders]
for item in x:
    for player in players:
        if unidecode.unidecode(player["name"]).replace(' Jr.','') == item["name"]:
            player["price"]["5"] = player["price"]["4"] + item["add"]
            player["stats"] = item["value"]
            
for player in players:
    if "5" not in player["price"].keys():
        player["price"]["5"] = player["price"]["4"]

# pprint.pprint(players)

handle = open("player-info.json", "w", encoding="utf8")
json.dump(players, handle, indent=6, ensure_ascii=False)
handle.close()
