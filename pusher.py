# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 17:11:23 2020

@author: Yichen Wang

Plan:
    I think I'll still be writing independent Markdown posts.
    Then after written, this code will be run to 
    - move the Markdown post to desired path, and name it formattedly
    - modify corresponding HTML content so the new file will be rendered
    - TODO: automatically do git add, commit, push
"""


#import argparse
from bs4 import BeautifulSoup
import os
import time
import argparse
import re
import shutil
import datetime

#DIVISION = 'coding' # "coding", "music", "cooking", 'anime"
#filename = "../temp.md"

parser = argparse.ArgumentParser(description='Update html pages with new posts')
parser.add_argument('-f', '--filename', metavar="Markdown", type=str, required=True,
                   help='Text file of new post in Markdown format')
parser.add_argument('-d', '--division', required=True,
                   help='sum the integers')
args = parser.parse_args()
filename = args.filename
DIVISION = args.division

if DIVISION not in ['coding', 'music', 'cooking', 'anime']:
    raise ValueError("DIVISION must be in {'coding', 'music', 'cooking', 'anime'}")

DIVISIONDic = {'coding': 'cd', 'music': 'ms', 'cooking': 'ck', 'anime': 'an'}
filePath = os.path.dirname(filename)
# First check if paths and files exists
if not os.path.isfile(filename):
    raise FileNotFoundError("Given file does not exists")

if not os.path.exists(os.path.join('blog', DIVISION)):
    raise PermissionError("Given division not valid")

# Rewrite Markdown with correct img path
newFileName = time.strftime('%Y_%m_%d_%H_%M') + '.md'
newFileName = os.path.join('blog', DIVISION, '_posts', newFileName)

mdDoc = open(filename, 'r').read()
imgSearcher = re.compile(r'!\[.*?\]\(.*?\)')
allImgExp = imgSearcher.findall(mdDoc)
replaceDic = {}
newNameInc = len(os.listdir(f'blog/{DIVISION}/images/'))
for imgExp in allImgExp:
    imgPathIdx = re.search(r'\(.*\)', imgExp).span()
    imgPath = imgExp[imgPathIdx[0]+1:imgPathIdx[1]-1]
    if imgPath not in replaceDic:
        if not imgPath.startswith('http'):
            realPath = os.path.join(filePath, imgPath)
            if not os.path.isfile(realPath):
                raise FileNotFoundError(f"Local imgae path '{realPath}' not found")
            extName = imgPath.split('.')[-1]
            newNameInc += 1
            newName = str(newNameInc) + '.' + extName
            newName = os.path.join(f'blog/{DIVISION}/images', newName).replace('\\', '/')
            shutil.copy(realPath, newName)
            newName = 'https://mvfki.github.io/' + newName
            replaceDic[imgPath] = newName
for old, new in replaceDic.items():
    mdDoc = mdDoc.replace(old, new)

# blog main page update, to show the latest post
blogPage = open('blog/index.html', 'r').read()
blogSoup = BeautifulSoup(blogPage, features="lxml")
recUpDiv = blogSoup.find('div', id='recentUpdate')
newScriptStr = "loadArticle('%s', 'recentUpdate');" % newFileName.replace("\\","/")
recUpDiv.script.string.replaceWith(newScriptStr)

# division main page update, to append a new post
divisionPage = open(os.path.join('blog', DIVISION, 'index.html'), 'r').read()
divisionSoup = BeautifulSoup(divisionPage, features='lxml')
## Article part
articleReg = divisionSoup.find('div', attrs='container')
newDivID = DIVISIONDic[DIVISION] + str(len(articleReg.find_all('section')) + 1)
scrTag = divisionSoup.new_tag('script', type="text/javascript")
scrTag.string = "loadArticle('%s', '%s');" % (newFileName.replace("\\","/"), newDivID)
divTag = divisionSoup.new_tag('div', id=newDivID)
divTag['class'] = 'image fit'
divTag.append(scrTag)
secTag = divisionSoup.new_tag('section')
secTag.append(divTag)
hr = divisionSoup.new_tag('hr')
secTag.append(hr)
secTag['class'] = 'article ' + time.strftime('%Y_%m')
articleReg.append(secTag)
## Month selection part
selReg = divisionSoup.find("select")
selOptions = selReg.findAll('option')
selValues = [i['value'] for i in selOptions]
if time.strftime('%Y_%m') not in selValues:
    newOption = divisionSoup.new_tag('option', value=time.strftime('%Y_%m'))
    newOption.string = datetime.datetime.now().strftime('%Y %B')
    selReg.append(newOption)

# Write to new file only after no error is raised
with open(newFileName, 'w') as newFile:
    newFile.write(mdDoc)
newFile.close()

with open('blog/index.html', 'w', encoding='utf8') as blogFile:
    blogFile.write(blogSoup.prettify(formatter="html"))
blogFile.close()

with open(f'blog/{DIVISION}/index.html', 'w', encoding='utf8') as artFile:
    artFile.write(divisionSoup.prettify(formatter="html"))
artFile.close()
