function loadArticle(name, divID) {
    if(window.location.href.startsWith('file://')){
        document.getElementById(divID).innerHTML = "<input type='file' id='in" + divID + "' onchange='readLocal(\"in" + divID + "\", \""+ divID + "\")'/>";
    } else if(window.location.href.startsWith('https://')){
        var text = readOnline(name, divID);
    }
};

function readLocal(inid, divID) {
    var converter = new showdown.Converter();
    var files = document.getElementById(inid).files;
    var file = files[0];
    const reader = new FileReader();
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            var text = evt.target.result;
            var html = converter.makeHtml(text);
            document.getElementById(divID).innerHTML = html;
        };
    }
    console.log(file)
    var blob = file.slice(0, file.size);
    reader.readAsText(blob);
};

function readOnline(filename, divID) {
    var converter = new showdown.Converter();
    var request = new XMLHttpRequest();
    //var url = 'https://raw.githubusercontent.com/mvfki/mvfki.github.io/master/' + name;
    request.open('GET', filename, true);
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
    };

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