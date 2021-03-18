import requests
import string
import re
from bs4 import BeautifulSoup
import csv
import json
import os

url = "https://hashtagbasketball.com/nba-rookie-rankings"
FILE = 'initial-rankings-rookies.json'

r = requests.get(url)
data = r.text
soup = BeautifulSoup(data, 'html.parser')

rankings = []

start = soup.find('table', id='ContentPlaceHolder1_GridView1').find_all('tr')

# print(start)
start.remove(start[0])

count = 1

for ranking in start:
    if ranking.find_all('td')[1].span:
        player = {
            "name": ranking.find_all('td')[1].span.string,
            "rank": count
        }
        rankings.append(player)
        count += 1

handle = open(FILE, "w", encoding="utf8")
json.dump(rankings, handle, indent=6, ensure_ascii=False)
handle.close()
