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
        'leaders': [ players[0],
                     players[1],
                     players[2],
                     players[3],
                     players[4],
                     players[5],
                     players[6],
                     players[7],
                     players[8],
                     players[9],
                     players[10],
                     players[11],
                     players[12],
                     players[13],
                     players[14],
                     players[15],
                     players[16],
                     players[17],
                     players[18],
                     players[19] ]
    }

    leaders.append(leaderBoard)

    players.clear()

handle = open(FILE, "w", encoding="utf8")
json.dump(leaders, handle, indent=6, ensure_ascii=False)
handle.close()
