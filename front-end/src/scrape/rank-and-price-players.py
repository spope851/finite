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

ranked_players = []
remove_ranks = []

FILE='player-info.json'
with open(FILE) as data:    
    players = json.load(data)

FILE='initial-rankings.json'
with open(FILE) as data:    
    ranks = json.load(data)

FILE='initial-rankings-rookies.json'
with open(FILE) as data:    
    rookie_ranks = json.load(data)

for rank in ranks:
    for player in players:
        if re.sub(r'[^\w\s]','',rank['name']) == re.sub(r'[^\w\s]','',player['name']):
            player['rank'] = rank['rank']
            ranked_players.append(player)
            remove_ranks.append(rank)
            break

ranks = [i for i in ranks if i not in remove_ranks]
players = [i for i in players if i not in ranked_players]

for rank in ranks:
    for player in players:
        r = re.sub(r"[^\w\s]","",rank["name"])
        if fnmatch.fnmatch(re.sub(r'[^\w\s]','',player['name']), f'{r.split(" ")[0][0]}{r.split(" ")[0][1]}* {r.split(" ")[1]}'):
            player['rank'] = rank['rank']
            ranked_players.append(player)
            remove_ranks.append(rank)
            break

ranks = [i for i in ranks if i not in remove_ranks]
players = [i for i in players if i not in ranked_players]

for rank in ranks:
    for player in players:
        r = re.sub(r"[^\w\s]","",rank["name"])
        if fnmatch.fnmatch(re.sub(r'[^\w\s]','',player['name']), f'{r.split(" ")[0]} {r.split(" ")[1][0]}{r.split(" ")[1][1]}*'):
            player['rank'] = rank['rank']
            ranked_players.append(player)
            remove_ranks.append(rank)
            break

ranks = [i for i in ranks if i not in remove_ranks]
players = [i for i in players if i not in ranked_players]

for rank in rookie_ranks:
    for player in players:
        if re.sub(r'[^\w\s]','',rank['name']) == re.sub(r'[^\w\s]','',player['name']):
            player['rank'] = round(rank['rank'] * 8.30, 2)
            ranked_players.append(player)
            remove_ranks.append(rank)
            break

rookie_ranks = [i for i in rookie_ranks if i not in remove_ranks]
players = [i for i in players if i not in ranked_players]

for player in players:
    player["rank"] = round(random.uniform(100, 300), 2)
    ranked_players.append(player)

# print(f'unmatched ranks: {len(ranks)}')
# print(ranks)
# print(f"unranked players: {len(players)}")
# print(players)
# print(f'unmatched rookies: {len(rookie_ranks)}')
# print(rookie_ranks)
# print(f"ranked: {len(ranked_players)}")

for player in ranked_players:
    if player["name"] == "Josh Green":
        player["rank"] = 298.8
        continue
    if player["name"] == "Aleksej Pokusevski":
        player["rank"] = 174.3
        continue

priced_players = []

for player in ranked_players:
    r = player["rank"]
    if player["rank"] >= 400:
        player["price"] = round(((r - 638.6) / -23.9), 2) # $3-10
        del player["rank"]
        priced_players.append(player)
    elif player["rank"] >= 300:
        player["price"] = round(((r - 478.6) / -7.1), 2) # $11-25
        del player["rank"]
        priced_players.append(player)
    elif player["rank"] >= 200:
        player["price"] = round(((r - 436.8) / -5.3), 2) # $26-45
        del player["rank"]
        priced_players.append(player)
    elif player["rank"] >= 100:
        player["price"] = round(((r - 391.7) / -4.2), 2) # $46-70
        del player["rank"]
        priced_players.append(player)
    else:
        player["price"] = round(((r - 351) / -3.5), 2) # $71-99
        del player["rank"]
        priced_players.append(player)

# handle = open("ranked-players.json", "w", encoding="utf8")
# json.dump(ranked_players, handle, indent=6, ensure_ascii=False)
# handle.close()

handle = open("player-info.json", "w", encoding="utf8")
json.dump(priced_players, handle, indent=6, ensure_ascii=False)
handle.close()
