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
            var contents = document.getElementById(divID).getElementsByTagName("*");
            var title = contents[0];
            title.id = 'h1' + divID;
            var titleLink = document.createElement("a")
            titleLink.href = '#' +divID;
            titleLink.appendChild(title);
            document.getElementById(divID).prepend(titleLink);

            var allPres = document.getElementsByTagName('pre');
            for (let i = 0; i < allPres.length; i++){
                allPres[i].className = 'prettyprint';
            }

            PR.prettyPrint();
            //document.getElementById('h1' + divID).outerHTML = titleLink.toString();
            title.onclick = function(){
                var contentElement = getFirstContentElement(divID);
                if (contentElement.style.display == 'none') {
                    showArticle(divID);
                } else {
                    hideArticle(divID);
                }
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
    var allMonths = [];
    for (let i = 0; i < files.length; i++) {
        var file = files[i];
        // Create section
        var sec = document.createElement("section");
        var month = file.name.substring(0,7);
        if (!allMonths.includes(month)) {
            allMonths.push(month);
        }
        sec.className = "article " + month;
        // Create div
        var postDiv = document.createElement("div");
        postDiv.className = "image post";
        postDiv.id = topicAbbr + (i+1).toString();
        // Read MD file and convert to HTML
        insertFile(file, postDiv.id);

        var opDiv = document.createElement("form");
        opDiv.className = "image post opDiv";
        opDiv.id = "opDiv" + postDiv.id;
        opDiv.action = "post.html";
        opDiv.method = 'get';

        var hiddenValue = document.createElement('input');
        hiddenValue.type = 'text';
        hiddenValue.value = file.name;
        hiddenValue.name = 'postName';
        hiddenValue.style.display = 'none';

        var hider = document.createElement("button");
        hider.className = "image post opDiv hider";
        hider.type = "button";
        setHider(hider, postDiv.id);
        hider.id = "hide" + postDiv.id;
        hider.href = '#' + postDiv.id;
        var hiderText = document.createTextNode("Hide");
        hider.appendChild(hiderText);

        var showOne = document.createElement("input");
        showOne.type = "submit"
        showOne.className = "image post opDiv showOne";
        showOne.id = 'show' + postDiv.id;
        showOne.value = "Show this only";

        opDiv.appendChild(hiddenValue);
        opDiv.appendChild(hider);
        opDiv.appendChild(showOne);

        var hr = document.createElement("hr");

        sec.appendChild(postDiv);
        sec.appendChild(opDiv);
        sec.appendChild(hr);
        artDiv.appendChild(sec);
    }
    insertMonths(allMonths);
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
                title.id = 'h1' + divID;
                var titleLink = document.createElement("a")
                titleLink.href = '#' +divID;
                titleLink.appendChild(title);
                document.getElementById(divID).prepend(titleLink);

                var allPres = document.getElementsByTagName('pre');
                for (let i = 0; i < allPres.length; i++){
                    allPres[i].className += ' prettyprint';
                }

                PR.prettyPrint();
                title.onclick = function(){
                    var contentElement = getFirstContentElement(divID);
                    if (contentElement.style.display == 'none') {
                        showArticle(divID);
                    } else {
                        hideArticle(divID);
                    }
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
    var allMonths = [];
    for(var i = 0; i < mds.length; i++) {
        var sec = document.createElement("section");
        var month = mds[i].substring(0,7);
        if (!allMonths.includes(month)) {
            allMonths.push(month);
        }
        sec.className = "article " + month;
        // Create div
        var postDiv = document.createElement("div");
        postDiv.className = "image post";
        postDiv.id = topicAbbr + (i+1).toString();
        // Read MD file and convert to HTML
        insertOnlineMD(mds[i], postDiv.id);
        var opDiv = document.createElement("form");
        opDiv.className = "image post opDiv";
        opDiv.id = "opDiv" + postDiv.id;
        opDiv.action = "post.html";
        opDiv.method = 'get';

        var hiddenValue = document.createElement('input');
        hiddenValue.type = 'text';
        hiddenValue.value = mds[i];
        hiddenValue.name = 'postName';
        hiddenValue.style.display = 'none';

        var hider = document.createElement("button");
        hider.className = "image post opDiv hider";
        hider.type = "button";
        setHider(hider, postDiv.id);
        hider.id = "hide" + postDiv.id;
        hider.href = '#' + postDiv.id;
        var hiderText = document.createTextNode("Hide");
        hider.appendChild(hiderText);

        var showOne = document.createElement("input");
        showOne.type = "submit"
        showOne.className = "image post opDiv showOne";
        showOne.id = 'show' + postDiv.id;
        showOne.value = "Show this only";

        opDiv.appendChild(hiddenValue);
        opDiv.appendChild(hider);
        opDiv.appendChild(showOne);
        var hr = document.createElement("hr");

        sec.appendChild(postDiv);
        sec.appendChild(opDiv);
        sec.appendChild(hr);
        artDiv.appendChild(sec);
    }
    insertMonths(allMonths);
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
    var path = 'https://raw.githubusercontent.com/mvfki/mvfki.github.io/master/blog/' + path;
    request.open('GET', path, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                var text = request.responseText;
                var html = converter.makeHtml(text);
                document.getElementById(divID).innerHTML = html;
                var allPres = document.getElementsByTagName('pre');
                var contents = document.getElementById(divID).getElementsByTagName("h1");
                var articleTitle = contents[0].textContent;
                if (document.title != 'WYC - Blog') {
                    document.title = articleTitle;
                }
                for (let i = 0; i < allPres.length; i++){
                    allPres[i].className += ' prettyprint';
                }

                PR.prettyPrint();
            } else {
                document.getElementById(divID).innerHTML = "Not text file";
            }
        } else {
            document.getElementById(divID).innerHTML = "Request state error";
        }
    }
}

// Load month show/hide selection
function insertMonths(months){
    var sel = document.getElementById('selMonth')
    for (var i = 0; i < months.length; i++) {
        var newMon = document.createElement('option');
        newMon.value = months[i];
        var newMonTxt = document.createTextNode(monID2Txt(months[i]));
        newMon.appendChild(newMonTxt);
        sel.appendChild(newMon);
    }
}

function monID2Txt(month){
    var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var year = month.substring(0, 4);
    var monNum = parseInt(month.substring(5, 7));
    var monTxt = MON[monNum-1];
    return year + ' ' + monTxt
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
    var parentDiv = document.getElementById(id)
    var contents = parentDiv.getElementsByTagName("*");
    for (var i = 1; i < contents.length; i++) {

        if (contents[i].parentElement == parentDiv){
            contents[i].style.display = "none";
        }
    }
    document.getElementById("opDiv"+id).style.display = 'none';
}

function showArticle(id) {
    var parentDiv = document.getElementById(id)
    var contents = parentDiv.getElementsByTagName("*");
    for (var i = 1; i < contents.length; i++) {
        if (contents[i].parentElement == parentDiv){
            contents[i].style.display = "block";
        }
    }
    document.getElementById("opDiv"+id).style.display = 'inline-flex';
}

function getFirstContentElement(divID) {
    var parentDiv = document.getElementById(divID);
    var contents = parentDiv.getElementsByTagName("*");
    for (var i = 1; i < contents.length; i++) {
        if (contents[i].parentElement == parentDiv){
            return contents[i];
        }
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function insertQRCode(id) {
    var qrcode = new QRCode(document.getElementById(id), {
                            width : 100,
                            height : 100
                            });
    qrcode.makeCode(window.location.href);
}

function insertURL(id) {
    var inputBox = document.getElementById(id);
    inputBox.value = window.location.href;
    inputBox.setAttribute('readonly', 'readonly');
}

function showShareContent(id){
    var content = document.getElementById(id);
    content.style.display = "block";
}

function copyURL(id) {
    var ib = document.getElementById(id);
    ib.select();
    document.execCommand('copy');
}

$(document).mouseup(function (e) {
    if ($(e.target).closest(".shareContent").length
                === 0) {
        $(".shareContent").hide();
    }
});

$( document ).ready(function() {
    $('#blogMenu').hover(function() {
        $('#dropdownContent').stop(true, true).slideDown(200);
    }, function() {
        $('#dropdownContent').stop(true, true).slideUp(200);
    });
})