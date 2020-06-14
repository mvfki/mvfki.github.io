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

#DIVISION = 'coding' # "coding", "music", "cooking", 'anime"
#filename = "../temp.md"

parser = argparse.ArgumentParser(description='Update html pages with new posts')

# 添加参数步骤
parser.add_argument('-f', '--filename', metavar="Markdown", type=str, required=True,
                   help='Text file of new post in Markdown format')
parser.add_argument('-d', '--division', required=True,
                   help='sum the integers')
# 解析参数步骤  
args = parser.parse_args()



filename = args.filename
DIVISION = args.division

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
mdLines = open(filename, 'r').read().splitlines()
imgSearcher = re.compile(r'!\[.*\]\(.*\)')
for nline in range(len(mdLines)):
    line = mdLines[nline]
    match = imgSearcher.match(line)
    if match:
        span = match.span()
        imgExp = line[span[0]:span[1]]
        imgPathIdx = re.search(r'\(.*\)', imgExp).span()
        imgPath = imgExp[imgPathIdx[0]+1:imgPathIdx[1]-1]
        if imgPath.startswith('http'):
            continue
        extName = imgPath.split('.')[-1]
        imgPath = os.path.join(filePath, imgPath)
        if os.path.isfile(imgPath):
            newName = str(len(os.listdir(f'blog/{DIVISION}/images/')) + 1) + '.' + extName
            newName = os.path.join(f'blog/{DIVISION}/images', newName)
            shutil.copy(imgPath, newName)
            newURL = 'https://mvfki.github.io/' + newName
            newImgExp = imgExp[:imgPathIdx[0]] + f'({newURL})'.replace('\\', '/')
            mdLines[nline] = line[:span[0]] + newImgExp + line[span[1]:]
        else:
            raise FileNotFoundError("Image file referred to '" + imgPath + "' not valid.")
newMDContent = '\n'.join(mdLines)

# blog main page update, to show the latest post
blogPage = open('blog/index.html', 'r').read()
blogSoup = BeautifulSoup(blogPage, features="lxml")
recUpDiv = blogSoup.find('div', id='recentUpdate')
newScriptStr = "loadArticle('%s', 'recentUpdate');" % newFileName.replace("\\","/")
recUpDiv.script.string.replaceWith(newScriptStr)


# division main page update, to append a new post
divisionPage = open(os.path.join('blog', DIVISION, 'index.html'), 'r').read()
divisionSoup = BeautifulSoup(divisionPage, features='lxml')
articleReg = divisionSoup.find('div', attrs='container')
if len(articleReg.find_all('section')) > 0:
    hr = divisionSoup.new_tag('hr')
    articleReg.append(hr)
newDivID = DIVISIONDic[DIVISION] + str(len(articleReg.find_all('section')) + 1)
scrTag = divisionSoup.new_tag('script', type="text/javascript")
scrTag.string = "loadArticle('%s', '%s');" % (newFileName.replace("\\","/"), newDivID)
divTag = divisionSoup.new_tag('div', id=newDivID)
divTag['class'] = 'image fit'
divTag.append(scrTag)
secTag = divisionSoup.new_tag('section')
secTag.append(divTag)
articleReg.append(secTag)

# Write to new file only after no error is raised
with open(newFileName, 'w') as newFile:
    newFile.write(newMDContent)
newFile.close()

with open('blog/index2.html', 'w', encoding='utf8') as blogFile:
    blogFile.write(blogSoup.prettify(formatter="html"))
blogFile.close()

with open(f'blog/{DIVISION}/index2.html', 'w', encoding='utf8') as artFile:
    artFile.write(divisionSoup.prettify(formatter="html"))
artFile.close()