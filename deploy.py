# -*- coding: utf-8 -*-
"""
Created on Tue Jul  7 11:38:01 2020

@author: Yichen Wang
"""
from bs4 import BeautifulSoup
import markdown
import os
import time
import re
import shutil
import http.server
import socketserver
import copy

PORT = 2333
Handler = http.server.SimpleHTTPRequestHandler

EXT = ['markdown.extensions.extra', 
       'markdown.extensions.toc', 
       'markdown.extensions.tables',
       'pymdownx.tilde',
       'pymdownx.superfences']
TOPICS = {'coding': 'cd', 'cooking': 'ck', 'music': 'ms', 'anime': 'an'}
TOPIC_FULLNAMES = list(TOPICS.keys())
MD_IMG_REGEX = re.compile(r'!\[.*?\]\(.*?\)')
IMG_URL_REGEX = re.compile(r'\(.*?\)')

ANCHOR = BeautifulSoup('<i aria-hidden="true" class="fas fa-link"></i>', 
                       features='lxml').i

class myPost():
    def __init__(self, filename, topic, template, insertID='articleDiv'):
        if not os.path.isfile(filename):
            raise FileNotFoundError(f"{filename} not a valid file")
        self.path = os.path.abspath(filename)
        self.dir = os.path.dirname(self.path)
        self.topic = topic
        if not filename.endswith('.md'):
            raise ValueError(f"Filename doesn't end with '.md'")
        self.baseName = os.path.basename(filename)
        
        nameTime = self.baseName[:-3]
        try:
            self.strptime = time.strptime(nameTime, '%Y_%m_%d_%H_%M')
        except ValueError:
            raise ValueError(f"{filename} has to be named with YYYY_mm_dd_hh_MM "
                             "style")
        
        self.markdown = open(self.path, 'r', encoding='UTF-8').read()
        
        self.images = []
        imageExps = MD_IMG_REGEX.findall(self.markdown)
        for imgExp in imageExps:
            idx = IMG_URL_REGEX.search(imgExp).span()
            imgPath = imgExp[idx[0]+1:idx[1]-1]
            if not imgPath.startswith('http'):
                imgPath = os.path.join(self.dir, imgPath)
                if not os.path.isfile(imgPath):
                    raise FileNotFoundError(f"Referred image file {imgPath} not found.")
                self.images.append(imgPath)
        self.insertID = insertID
        self.deploy(template)
    
    def deploy(self, template):
        templateHtml = open(template, 'r').read()
        html = markdown.markdown(self.markdown, extensions=EXT)
        innerHTML = BeautifulSoup(html, features='lxml')
        soup = BeautifulSoup(templateHtml, features='lxml')
        ad = soup.find('div', id=self.insertID)
        sec = soup.new_tag('section')
        postdiv = soup.new_tag('div')
        postdiv.attrs['class'] = 'image post'
        for i in innerHTML.html.body.children:
            postdiv.append(i)
        sec.append(postdiv)
        ad.append(sec)
        timeSpan = BeautifulSoup(f'<span>{time.strftime("%Y-%m-%d", self.strptime)}</span>', 
                                 features='lxml').span
        ## Code block settings
        #pres = soup.findAll('pre')
        #for i in pres:
        #    i.attrs['class'] = 'prettyprint'
        titleHTML = ad.findAll('h1')[0]
        titleHTML.insert_before(timeSpan)
        soup.title.string = re.sub(r'<.*?>', '', str(titleHTML)) + ' - WYC\'s Blog'
        
        allHeaders = ad.find_all(re.compile('^h[1-6]$'))
        for header in allHeaders[1:]:
            try:
                headerID = header.attrs['id']
                anchorA = soup.new_tag('a', attrs={'id': 'anchor-'+headerID, 
                                                   'class': 'anchor', 
                                                   'href': '#'+headerID})
                anchorA.append(copy.copy(ANCHOR))
                header.insert(0, anchorA)
            except KeyError:
                continue
        self.soup = soup
        disqusConfig = soup.find('script', id='disqusConfig')
        disqusConfig.string = disqusConfig.string.replace("*POSTVAR*", self.ID)
        
    def addLastPage(self, postID=None):
        lastBtn = self.soup.find('a', id='lastBtn')
        if postID != None:
            lastBtn.attrs['href'] = '../'+postID
        else:
            lastBtn.attrs['class'].append('disabled')
    def addNextPage(self, postID=None):
        nextBtn = self.soup.find('a', id='nextBtn')
        if postID != None:
            nextBtn.attrs['href'] = '../'+postID
        else:
            nextBtn.attrs['class'].append('disabled')
        
    @property
    def title(self):
        '''
        Returns the text after first single-hash markdown syntax
        '''
        ad = self.soup.find('div', id=self.insertID)
        h1 = ad.findAll('h1')[0]
        return re.findall(r'<h.*?>(.*?)</h[0-9]>', str(h1))[0]        
    
    @property
    def ID(self):
        '''
        Return the HTML element id of the title
        '''
        ad = self.soup.find('div', id=self.insertID)
        h1s = ad.findAll('h1')
        return h1s[0].attrs['id']
        
    @property
    def time(self):
        return time.strftime('%Y/%m/%d %H:%M', self.strptime)

    @property
    def html(self):
        '''
        Returns ready-to-write HTML string
        '''
        return str(self.soup)
    
    def __repr__(self):
        return f"<Post object, {self.ID}, {self.time}>"

def rewriteAll():
    allAllPosts = []
    for topic in TOPIC_FULLNAMES:
        allPosts = []
        try:
            allFiles = os.listdir(os.path.join('blog', topic, '_src'))
            allMDs = [os.path.join('blog', topic, '_src', i) for i in allFiles if i.endswith('.md')]
            template = os.path.join('blog', topic, '_src', 'template.html')
            assert os.path.isfile(template)
        except:
            allMDs = []
            template = ''
        
        for md in allMDs:
            post = myPost(md, topic, template)
            allPosts.append(post)
        allPosts = sorted(allPosts, key=lambda x: x.strptime)
        allAllPosts += allPosts
        # Write next/last button property
        if len(allPosts) > 1:
            for i in range(len(allPosts)):
                post = allPosts[i]
                if i == 0:
                    post.addLastPage()
                    post.addNextPage(allPosts[i+1].ID)
                elif i == len(allPosts) - 1:
                    post.addNextPage()
                    post.addLastPage(allPosts[i-1].ID)
                else:
                    post.addLastPage(allPosts[i-1].ID)
                    post.addNextPage(allPosts[i+1].ID)
        elif len(allPosts) == 1:
            allPosts[0].addNextPage()
            allPosts[0].addLastPage()
        # Write static html to file 
        for post in allPosts:
            newHTMLPath = os.path.join('blog', topic, post.ID)
            if not os.path.isdir(newHTMLPath):
                os.makedirs(newHTMLPath)
            with open(os.path.join(newHTMLPath, 'index.html'), 'w', encoding="UTF-8") as file:
                print('writing', post.ID)
                file.write(post.html)
            file.close()
            for img in post.images:
                shutil.copy(img, newHTMLPath)
                
        # Prepare content element
        contentList = BeautifulSoup('<ul></ul>', features='lxml')
        for post in allPosts:
            li = contentList.new_tag('li', attrs={'class': ['content', 'cItem', time.strftime('%Y-%m', post.strptime)],
                                                  'onclick': f"location.href='{post.ID}'"})
            li_div = contentList.new_tag('div', attrs={'class': ['content', 'cItem', 'cTitle'], 
                                                       'href': post.ID})
            li_div_inner = BeautifulSoup(post.title, features='lxml')
            li_div.append(li_div_inner.p)
            li_span = contentList.new_tag('span', attrs={'class': ['content', 'cItem', 'cTime']})
            li_span.string = post.time
            li.append(li_div)
            li.append(li_span)
            contentList.ul.append(li)
        allTime = [i.strptime for i in allPosts]
        maxTime = time.strftime('%Y-%m', max(allTime))
        minTime = time.strftime('%Y-%m', min(allTime))

        # Write content page
        try:
            with open(os.path.join('blog', topic, 'index.html'), 'r', encoding='UTF-8') as contentFile:
                print('writing content page of', topic)
                contentPage = contentFile.read()
            contentFile.close()
            contentSoup = BeautifulSoup(contentPage, features='lxml')
            contentSoup.find('div', id='contentDiv').ul.replace_with(contentList.ul)
            contentSoup.find('input', id='monthSelect').attrs['max'] = maxTime
            contentSoup.find('input', id='monthSelect').attrs['min'] = minTime
            with open(os.path.join('blog', topic, 'index.html'), 'w', encoding='UTF-8') as contentFile:
                contentFile.write(contentSoup.prettify())
            contentFile.close()
        except:
            pass
    allAllPosts = sorted(allAllPosts, key=lambda x: x.strptime)

    # Update blog root latest preview
    latest = allAllPosts[-1]
    latestArtBlock = latest.soup.find('div', id="articleDiv")
    blogSoup = BeautifulSoup(open('blog/index.html', 'r', encoding='UTF-8').read(), features='lxml')
    blogSoup.find('a', id='viewAll').attrs['href'] = latest.topic+'/'+latest.ID
    preview = BeautifulSoup('<section><div class="image post"></div></section>', features='lxml')
    for i in list(latestArtBlock.div.children)[:5]:
        preview.div.append(i)
    blogSoup.find('div', id="articleDiv").section.replace_with(preview.section)
    
    with open('blog/index.html', 'w', encoding='UTF-8') as outBlog:
        print('writing blog')
        outBlog.write(str(blogSoup))
    outBlog.close()

def startServer():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"serving at 127.0.0.1:{PORT}")
        httpd.serve_forever()

if __name__ == '__main__':
    rewriteAll()
    startServer()