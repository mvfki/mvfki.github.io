# Home Page - Yichen Wang
→ [Have a look here](https://mvfki.github.io/)  
This repository is for my home page. It's all because I suddenly got interested in owning a home page... 

## HTML, CSS and JS template
The template used for the web pages is called [Ion](https://templated.co/ion), designed [TEMPLATED](https://templated.co/). 
The template provides the most basic layouts and widges styles and colorings.  

The comment regions below article pages are powered by [Disqus](https://disqus.com/).
## Design
The substructure of this web site is the simplest tree style:
```
/index.html
/<JS and styles folders>/
/blog/
|-----index.html
|-----<topic folders>/
      |---------------index.html
      |---------------<article1 folder>/
                      |-----------------index.html
                      |-----------------<images>
      |---------------<article2 folder>/
                      |-----------------index.html
      |---------------_src/
                      |----<markdown files>
                      |----<images>
                      |----template.html
```
Though the [Jekyll](https://jekyllrb.com/) solution for deploying a static blog is really convenient, I still prefer a deeply customized HTML layout. 
So I wrote my own deployment code, which simply works by convert Markdown files to HTML content and insert to the proper `<div>` in `template.html`.

## Deployer Dependency
The article page deployments are done specially with: [markdown](https://python-markdown.github.io/) and [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup/).
```
pip install markdown beautifulsoup4
```

## How to post
Well, this might only be useful for myself, but let me still take a note here, in case I forget it years later.  
- Prepare a Markdown document, and name it with a strftime format such as `2020_07_07_22_26.md`
```markdown
# Dinner for today
![Photo of a home made pizza](pizza.png)
I made a **pizza** on my own today.
Jul. 7th, 2020
```
- Put `2020_07_07_22_26.md` and `pizza.png` together in the `_src` folder of the topic
```bash
$ mv 2020_07_07_22_26.md blog/cooking/_src/
$ mv pizza.png blog/cooking/_src/
```

- Run deployer script in command line tool.  
```shell
$ python deploy.py
```
When the deployment is done, a localhost server will be started for debugging.  

- After you are totally satisfied with the outcome, commit and push
```shell
git add *
git commit -m 'SAY SOMETHING'
git push origin master
```

## Copyright
The original HTML template, ION, by Templated, is distributed under a [CCPL lisence](https://github.com/mvfki/mvfki.github.io/blob/master/LICENSE.txt).  

As for my personal addition, currently there is nothing smart in coding, and very few articles. 
Image contents in-repo (you can tell by image URL) are all screenshots except specially stated (e.g. album covers).
Thus I'm not planning to work to much on copyright issue until I really push something special.  
So feel free to refer to anything here or give me a kind advice in [Issues](https://github.com/mvfki/mvfki.github.io/issues/new)!

## Others
Before this version, where I use local program to deploy real static pages, I actually was using another weird way, which you can have a look at [this branch](https://github.com/mvfki/mvfki.github.io/tree/clientSideDeploy). In that version, the page a visitor finally see is actually fully deployed on the visitor's browser. A JavaScript code was written to request and parse all the Markdown files in the repo and automatically render them to an empty page already loaded on the client side.  
