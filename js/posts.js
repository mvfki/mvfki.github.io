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