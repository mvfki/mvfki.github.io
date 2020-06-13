# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 17:11:23 2020

@author: Yichen Wang

Plan:
    I think I'll still be writing independent Markdown posts.
    Then after written, this code will be run to 
    - move the Markdown post to desired path, and name it formattedly
    - modify corresponding HTML content so the new file will be rendered
    - automatically do git add, commit, push

NOTE:
    I found if the Markdown includes images, it might be really hard to handle
    So I'll just first include HTML modifier here, and do some minor manual 
    check for imgages and homepage.
"""


#import argparse
from bs4 import BeautifulSoup
import os
import time
import shutil
import argparse

#DIVISION = 'cooking' # or "music", "cooking", 'anime"
#filename = "blog/coding/_posts/2020_06_13_14_02.md"

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

# First check if paths and files exists
if not os.path.isfile(filename):
    raise FileNotFoundError("Given file does not exists")

if not os.path.exists(os.path.join('blog', DIVISION)):
    raise PermissionError("Given division not valid")

newFileName = time.strftime('%Y_%m_%d_%H_%M') + '.md'
newFileName = os.path.join('blog', DIVISION, '_posts', newFileName)
shutil.copy(filename, newFileName)

# blog main page update, to show the latest post
blogPage = open('blog/index.html', 'r').read()
blogSoup = BeautifulSoup(blogPage, features="lxml")
recUpDiv = blogSoup.find('div', id='recentUpdate')
newScriptStr = "loadArticle('%s', 'recentUpdate');" % newFileName.replace("\\","/")
recUpDiv.script.string.replaceWith(newScriptStr)
with open('blog/index.html', 'w', encoding='utf8') as blogFile:
    blogFile.write(blogSoup.prettify(formatter="html"))
blogFile.close()

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

with open(f'blog/{DIVISION}/index.html', 'w', encoding='utf8') as artFile:
    artFile.write(divisionSoup.prettify(formatter="html"))
artFile.close()



