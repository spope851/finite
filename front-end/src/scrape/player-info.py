import requests
import string
import re
from bs4 import BeautifulSoup
import csv
import json
import os
import time

def plusForSpaceList(l):
    res = []
    for name in l:
        res.append(name.replace(' ','+'))
    return res

FILE='player-names.json'
with open(FILE) as data:    
    names = json.load(data)
    
url = 'https://www.balldontlie.io/api/v1/players?search='
apiNames=plusForSpaceList(names)
players=[]
count=0
test=[]

for name in apiNames:
    r=requests.get(url+name)
    print(r)
    if r.status_code == 429:
        time.sleep(60)
        r=requests.get(url+name)
        print(r)
    else:
        if r.status_code != 200:
            print(r.status_code)
        if r.json()['meta']['total_count'] == 0:
            print('no results for: '+name)
            r=requests.get(url+(name.split('+')[1]))
            print(r)
            if r.status_code == 429:
                time.sleep(60)
                r=requests.get(url+(name.split('+')[1]))
                print(r)
            else:
                if r.status_code != 200:
                    print(r.status_code)
                if r.json()['meta']['total_count'] > 1:
                    print('> 1 for: '+(name.split('+')[1]))
                if r.json()['meta']['total_count'] == 0:
                    print('no results for: '+(name.split('+')[1]))
                    r=requests.get(url+(name.split('+')[0]))
                    print(r)
                    if r.status_code == 429:
                        time.sleep(60)
                        r=requests.get(url+(name.split('+')[0]))
                        print(r)
                    else:
                        if r.status_code != 200:
                            print(r.status_code)
                        if r.json()['meta']['total_count'] > 1:
                            print('> 1 for: '+(name.split('+')[0]))
                    test.append(r)
                    continue
            test.append(r)
            continue            
    test.append(r)

for i in test:
    if i.status_code == 200:
        jsn = i.json()
        player = {
            'name': jsn['data'][0]['first_name'] + ' ' + jsn['data'][0]['last_name'],
            'height': str(jsn['data'][0]['height_feet']) + '\'' + str(jsn['data'][0]['height_inches']),
            'weight': jsn['data'][0]['weight_pounds'],
            'position': jsn['data'][0]['position'],
            'team': jsn['data'][0]['team']['id']
        }
        players.append(player)
        print(count)
        count+=1
    else:
        print(i.status_code)
        count+=1
    
handle = open('player-info.json', "w", encoding='utf8')
json.dump(players, handle, indent=6, ensure_ascii=False)
handle.close()
