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

FILE='player-info.json'
with open(FILE, encoding="utf8") as data:    
    players = json.load(data)
    
for player in players:
  player["volume"] = 0

# pprint.pprint(players)

handle = open("player-info.json", "w", encoding="utf8")
json.dump(players, handle, indent=6, ensure_ascii=False)
handle.close()
