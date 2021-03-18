import requests
import string
import re
from bs4 import BeautifulSoup
import csv
import json
import os

url = "https://nbamath.com/crystalbasketball-ranking-all-nba-players-for-2019-20/"
FILE = 'initial-rankings.json'

r = requests.get(url)
data = r.text
soup = BeautifulSoup(data, 'html.parser')

players_dirty = []
rankings = []

start = soup.find('h2', string='Shouldn’t Get Minutes: 1.00 to 1.49')

for ranking in start.find_next_siblings('p'):
    players_dirty.append(ranking.string)


for player in players_dirty:
    rankings.append(player.split(' ',1)[1].split(',',1)[0])

rankings[568] = 'Giannis Antetokounmpo'
rankings.reverse()
rankings[215] = 'Wesley Matthews'

final = []
count = 1

for rank in rankings:
    player = {
        "name": rank,
        "rank": count
    }
    final.append(player)
    count += 1

handle = open(FILE, "w", encoding="utf8")
json.dump(final, handle, indent=6, ensure_ascii=False)
handle.close()
