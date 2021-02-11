import requests
import string
import re
from bs4 import BeautifulSoup
import csv
import json
import os

url = "https://www.basketball-reference.com/leagues/NBA_2021_leaders.html"
FILE = 'season-leaders.json'

names = []
r = requests.get(url)
data = r.text
soup = BeautifulSoup(data, 'html.parser')

leaders = []
players = []

for table in soup.find_all('table', 'columns'):
    # print(table.caption.string) # stat
    players.append(table.tr.td.find_next_sibling('td').a.string) # all first place
    
    places = table.tr.find_next_siblings('tr')
    for place in places:
        players.append(place.find('a').string) # all additional places
    
    
    leaderBoard = {
        'stat': table.caption.string,
        'first': players[0],
        'second': players[1],
        'third': players[2],
        'fourth': players[3],
        'fifth': players[4],
        'sixth': players[5],
        'seventh': players[6],
        'eighth': players[7],
        'ninth': players[8],
        'tenth': players[9],
        'eleventh': players[10],
        'twelfth': players[11],
        'thirteenth': players[12],
        'fourteenth': players[13],
        'fifteenth': players[14],
        'sixteenth': players[15],
        'seventeenth': players[16],
        'eighteenth': players[17],
        'nineteenth': players[18],
        'twentieth': players[19]
    }

    leaders.append(leaderBoard)

    players.clear()

handle = open(FILE, "w", encoding="utf8")
json.dump(leaders, handle, indent=6, ensure_ascii=False)
handle.close()
