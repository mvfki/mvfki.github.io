function loadArticle(topic) {
    //document.getElementById("articleDiv").innerHTML = "<input type='file' id='readContIn' onchange='loadFromContentFile(\"" + topic + "\");'/>";
    if(window.location.href.startsWith('file://')){
        document.getElementById("articleDiv").innerHTML = "<input type='file' id='readContIn' onchange='loadInputContents(\"" + topic + "\");' multiple>All MD to load</input>";
    } else if(window.location.href.startsWith('https://')){
        loadFromContentFile(topic);
    }
};

// Local loader functions
function insertFile(file, divID){
    var reader = new FileReader();
    var converter = new showdown.Converter();
    reader.onload = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            var text = evt.target.result;
            var html = converter.makeHtml(text);
            document.getElementById(divID).innerHTML = html;
            hideArticle(divID);
            var title = document.getElementById(divID).getElementsByTagName('*')[0];
            title.onclick = function(){
                showArticle(divID);
            }
        }
    }
    var blob = file.slice(0, file.size);
    reader.readAsText(blob);
}

function setHider(hider, divID) {
    hider.onclick = function(){
        hideArticle(divID);
    }
}

function loadInputContents(topicAbbr){
    var files = document.getElementById("readContIn").files;
    var artDiv = document.getElementById("articleDiv");
    for (let i = 0; i < files.length; i++) {
        var file = files[i];
        // Create section
        var sec = document.createElement("section");
        var month = file.name.substring(0,7);
        sec.className = "article " + month;
        // Create div
        var postDiv = document.createElement("div");
        postDiv.className = "image post";
        postDiv.id = topicAbbr + (i+1).toString();
        // Read MD file and convert to HTML
        insertFile(file, postDiv.id);
        
        var hider = document.createElement("a");
        setHider(hider, postDiv.id);
        hider.id = "hide" + postDiv.id;
        var hiderText = document.createTextNode("Hide");
        hider.appendChild(hiderText);

        var hr = document.createElement("hr");

        sec.appendChild(postDiv);
        sec.appendChild(hider);
        sec.appendChild(hr);
        artDiv.appendChild(sec);
    }
    
}

// Online loader functions
function insertOnlineMD(filename, divID) {
    var converter = new showdown.Converter();
    var request = new XMLHttpRequest();
    //var url = 'https://raw.githubusercontent.com/mvfki/mvfki.github.io/master/blog/coding/posts/' + filename;
    var url = 'posts/' + filename;
    request.open('GET', url, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                var text = request.responseText;
                var html = converter.makeHtml(text);
                document.getElementById(divID).innerHTML = html;
                hideArticle(divID);
                var title = document.getElementById(divID).getElementsByTagName('*')[0];
                title.onclick = function(){
                    showArticle(divID);
                }
            } else {
                document.getElementById(divID).innerHTML = "Not text file";
            }
        } else {
            document.getElementById(divID).innerHTML = "Request state error";
        }
    }
}

function loadMDs(mds, topicAbbr) {
    var artDiv = document.getElementById("articleDiv");
    for(var i = 0; i < mds.length; i++) {
        var sec = document.createElement("section");
        var month = mds[i].substring(0,7);
        sec.className = "article " + month;
        // Create div
        var postDiv = document.createElement("div");
        postDiv.className = "image post";
        postDiv.id = topicAbbr + (i+1).toString();
        // Read MD file and convert to HTML
        insertOnlineMD(mds[i], postDiv.id);
        var hider = document.createElement("a");
        setHider(hider, postDiv.id);
        hider.id = "hide" + postDiv.id;
        var hiderText = document.createTextNode("Hide");
        hider.appendChild(hiderText);

        var hr = document.createElement("hr");

        sec.appendChild(postDiv);
        sec.appendChild(hider);
        sec.appendChild(hr);
        artDiv.appendChild(sec);
    }
}

function loadFromContentFile(topic) {
    // For Local Debug Use
    // var files = document.getElementById("readContIn").files;
    // var contentFile = files[0];
    // var reader = new FileReader();
    // reader.onload = function(evt) {
    //     if (evt.target.readyState == FileReader.DONE) { // DONE == 2
    //         var text = evt.target.result;
    //         var mds = text.split("\n");
    //         loadMDs(mds, topic)
    //     }
    // }
    // var blob = contentFile.slice(0, contentFile.size);
    // reader.readAsText(blob);
    var request = new XMLHttpRequest();
    var url = 'posts/CONTENTS.txt';
    request.open('GET', url, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            var text = request.responseText;
            var mds = text.split('\n');
            loadMDs(mds, topic);
        } else {
            document.getElementById("articleDiv").innerHTML = "";
        }
    }
};

// Load specific article
function loadRecent(path, divID){
    var converter = new showdown.Converter();
    var request = new XMLHttpRequest();
    //var path = 'https://raw.githubusercontent.com/mvfki/mvfki.github.io/master/blog/' + path;
    request.open('GET', path, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                var text = request.responseText;
                var html = converter.makeHtml(text);
                document.getElementById(divID).innerHTML = html;
            } else {
                document.getElementById(divID).innerHTML = "Not text file";
            }
        } else {
            document.getElementById(divID).innerHTML = "Request state error";
        }
    }
}

// Dynamic effect functions
function showMonth() {
    var sel = document.getElementById("selMonth").value;
    var allArt = document.getElementsByClassName("article");
    if (sel == 'all'){
        // Just display all articles
        for (var i = 0; i < allArt.length; i++){
            allArt[i].style.display = 'block';
        }
    } else {
        // Don't show anything but the selected month
        for (var i = 0; i < allArt.length; i++){
            allArt[i].style.display = 'none';
        }
        var month = document.getElementsByClassName(sel);
        for (var i = 0; i < month.length; i++){
            month[i].style.display = 'block';
        }
    }
}

function hideArticle(id) {
    var contents = document.getElementById(id).getElementsByTagName("*");
    for (var i = 1; i < contents.length; i++) {            
        contents[i].style.display = 'none';
    }
    document.getElementById("hide"+id).style.display = 'none';
}

function showArticle(id) {
    var contents = document.getElementById(id).getElementsByTagName("*");
    for (var i = 1; i < contents.length; i++) {
        if (contents[i].tagName == "CODE"){
            if(contents[i-1].tagName != "PRE"){
                contents[i].style.display = "unset";
            } else {
                contents[i].style.display = 'block';
            }
        } else {
            contents[i].style.display = 'block';
        }
    }
    document.getElementById("hide"+id).style.display = 'block';
}


