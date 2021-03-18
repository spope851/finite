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
with open(FILE) as data:    
    players = json.load(data)

for player in players:
    if len(player["price"].keys()) == 1:
        player["price"]["2"] = player["price"]["1"]

# print(players)

handle = open("player-info.json", "w", encoding="utf8")
json.dump(players, handle, indent=6, ensure_ascii=False)
handle.close()
