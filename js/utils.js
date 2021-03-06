/* MISC
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
*/

$(document).ready(function () {

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        $("html").attr("color-scheme", "dark");
    }
    var darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addListener(function(e) {
        if (e.matches) {
            $("html").attr("color-scheme", "dark");
        } else {
            $("html").removeAttr("color-scheme");
        }
    });

    $('#blogMenu').hover(function() {
        $('#dropdownContent').stop(true, true).slideDown(200);
    }, function() {
        $('#dropdownContent').stop(true, true).slideUp(200);
    });

    $('.corner').click(function() {
        window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth', 
        });
    });

    $('#clearMonth').click(function() {
        $('#monthSelect').val('');
        $('.cItem').show();
    })

    $('#monthSelect').change(function() {
        $('li.cItem').hide();
        $('.' + $(this).val()).show();
    });

    if ($('#banner').length != 0) {
        var imgs = ['/blog/music/images/banner.png', 
                    '/blog/coding/images/banner.png', 
                    '/blog/cooking/images/banner.jpg', 
                    '/blog/anime/images/banner.jpg'];
        var img = imgs[Math.floor(Math.random()*imgs.length)];
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            $('#banner').css('background', "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('" + img + "'), no-repeat, center, center");
            $('#banner').css('background-size', "cover");
        } else {
            $('#banner').css('background-image', "url('" + img + "')");
        }
        setInterval(function () {
            var img = imgs[Math.floor(Math.random()*imgs.length)];
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                $('#banner').css('background', "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('" + img + "'), no-repeat, center, center");
                $('#banner').css('background-size', "cover");
            } else {
                $('#banner').css('background-image', "url('" + img + "')");
            }   
        }, 5000)
    }
    
    
     
});

$(window).on('load', function () {
    $('body').removeClass('hidden');
})

$(window).scroll(function() {
    var y = $(this).scrollTop();
    var w = window.innerWidth;
    if (y > 350) {
        $('.corner').fadeIn(200);
    } else {
        $('.corner').fadeOut(200);
    };

    if (window.innerWidth > 1420) {
        if (y > 400) {
            $('#content-nav').slideDown(200);
        } else {
            $('#content-nav').fadeOut(200);
        };
    }
});

$(window).resize(function() {
    var y = $(this).scrollTop();
    var w = window.innerWidth;
    if (y > 400) {
        if (w > 1420) {
            $('#content-nav').slideDown(200);
        } else {
            $('#content-nav').fadeOut(200);
        }
    }
})
