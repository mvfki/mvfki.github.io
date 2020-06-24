# mvfki.github.io
This repository is for my home page. It's all because I suddenly got interested in owning a home page... 

## HTML template
The template used for the web pages is called [Ion](https://templated.co/ion), designed [TEMPLATED](https://templated.co/). 
The template provides the most basic layouts and widges styles and colorings.  
## Original design
The substructure of this web site is the simplest tree style:
```
/index.html
/<JS and styles folders>
/blog
 --/index.html
 --/<topic folders>
    --/index.html
    --/<content folders>
```
Though the [Jekyll](https://jekyllrb.com/) solution for distributing a static blog is really convenient, I still prefer a customized HTML layout. 
Thus in order to optimize the future debugging and posting process, I added two simple features:

#### Automatically render Markdown posts to web pages
Since using a Jekyll theme seems like we can post a Markdown article and soon see it deployed. I tried to implement a similar feature in `js/posts.js`.
In this way, we only need to insert a short formated block into topic page and the new article in the content folder will be rendered. 
The good thing about this is that there won't be any long paragraphs within an HTML document and I don't get confused if I want to update or debug the functionality. 

#### Automatically deploy post files
Since I would like to render article contents from Markdown files, I would have to be careful of file paths, as well as any image path associated with Markdown articles.
Therefore, renaming and moving files to correct directory, inserting short block into HTML documents, and commiting and pushing the changes to remote are all done by `pusher.py`. 
I didn't write this script in a formal coding style because it's just a one-way run.

## How to post
Well, this might only be useful for myself, but let me still take a note here, in case I forget it years later.  
- Prepare a Markdown document anywhere you like, called `myPost.md`
```
## Dinner for today
I made a **pizza** on my own today.
Jun. 24th, 2020
```

- Run pusher script in command line tool.  
Note that `-f` is for the MD filename and `-d` for the topic.
```{shell}
$ python pusher.py -f myPost.md -d cooking
```
Follow the prompts on the screen and everything will be done.

- Python script dependencies, in case.
```
pip install beautifulSoup4 gitpython
```

## Copyright
The original HTML template, ION, by Templated, is distributed under a [CCPL lisence](https://github.com/mvfki/mvfki.github.io/blob/master/LICENSE.txt).  

As for my personal addition, currently there is nothing smart in coding (all taken from stackoverflow LOL), and very few articles. 
Image contents in-repo (you can tell by image URL) are all screenshots except specially stated (e.g. album covers).
Thus I'm not planning to work to much on copyright issue until I really push something special.  
So feel free to refer to anything here or give me a kind advice in [Issues](https://github.com/mvfki/mvfki.github.io/issues/new)!
