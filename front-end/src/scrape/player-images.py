import requests
import string
import re
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary
from selenium.webdriver.firefox.options import Options
import csv
import json
import os

FILE='player-info.json'
with open(FILE) as data:    
    playerInfo = json.load(data)

options = Options()
options.headless = False
 
url = "https://www.nba.com/players"

binary = '/usr/bin/firefox'
driver = webdriver.Firefox(options=options, firefox_binary=binary)
driver.get(url)
driver.find_element_by_xpath("//select[@class='DropDown_select__5Rjt0']/option[@value='-1']").click()
data = driver.page_source
# print(page)

# r = requests.get(url)
# data = r.text
soup = BeautifulSoup(data, 'html.parser')
player_tags=soup.find_all(class_=re.compile("PlayerImage_"))
images = {}
for tag in player_tags:
    images[tag['alt'].replace(' Headshot','')] = tag['src']

for player in playerInfo:
    if player['name'] in images.keys():
        player['image'] = images[player['name']]
        
unmatched = [i for i in playerInfo if i['name'] not in images.keys()]

for player in unmatched:
    if re.sub(r'[^\w\s]','',player['name']) in images.keys():
        player['image'] = images[re.sub(r'[^\w\s]','',player['name'])]
    else:
        print('no match')
    
handle = open(FILE, "w", encoding='utf8')
json.dump(playerInfo, handle, indent=6, ensure_ascii=False)
handle.close()
