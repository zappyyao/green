
var IsLoadFinished = false;
var body_finished_class = "finished",
    body_loadingfinished_class = "loading-finished";
var now = new Date().getTime();

var loading_duration = 500,
    page_load_time = now - performance.timing.navigationStart + 1000,
    page_load_animation_delay = 2500,
    page_finished_duration = page_load_time + loading_duration + page_load_animation_delay;

var latestSectionClassName = ".latest__section";

$.fn.menuFloat = function (options) {
    var defaults = {
        activeClass: "",
        position: "right",//top,right,bottom,left
        scrollHeight_show: 0,//px
    };
    var settings = this.options = $.extend({
        ori_activeClass: "float-bar-fixed"
    }, defaults, options);

    var $this = $(this), $body = $("body");

    $body.addClass(settings.ori_activeClass).addClass(settings.activeClass);
    $this.addClass("fbf-" + settings.position);

    var _loadfloat = function (loadttype) {
        if ($(this).scrollTop() >= settings.scrollHeight_show) {
            $this.addClass("active").removeClass("inactive");
            //$this.addClass("active");
        } else {

            if (loadttype == "scroll" && $this.hasClass("active")) {
                $this.addClass("inactive").delay(100).stop().promise().done(function () {
                    $this.removeClass("active");
                });
            }
            //$this.removeClass("active");
        }
    }


    _loadfloat("firstload");
    $(window).scroll(function () {
        _loadfloat("scroll");
    });
};

$(function () {
    //判斷IE
    if (isIE())
        $('body').addClass("ie");

    //loading 動畫
    $(".loader").addClass("move");
    $(".loading-bar").delay(loading_duration).promise().done(function () {
        $(this).css({
            height: "100%",
            "transition-duration": page_load_time / 1000 + "s"
        }).delay(page_load_time).promise().done(function () {
            $("body").addClass(body_finished_class).delay(page_load_animation_delay).promise().done(function () {
                IsLoadFinished = true;
                $("body").addClass(body_loadingfinished_class);
                $(".menufloat").menuFloat();
                $(".loader").remove();
                ShowWave();

            });
        });
    });

    var position_pagescroll = $(window).scrollTop();
    $(window).scroll(function () {
        //#region page banner parallex
        var banner_parallex_speed = 0.5;
        var $banner_content = $(".banner-content");
        if ($banner_content && $banner_content.length > 0) {
            if ($banner_content.hasClass("fixed")) {
                var scrolltop = $(this).scrollTop();
                var win_top = scrolltop * banner_parallex_speed;
                var _bannerImg = $banner_content.children("img");
                if ($banner_content.hasClass("fixed1") && !_bannerImg.hasClass("ps-top0"))
                    win_top += 220;

                _bannerImg.css({
                    "-webkit-transform": "translate(0," + win_top + "px)",
                    "transform": "translate(0," + win_top + "px)",
                });
            }
        }
        //#endregion


        //#region gotop btn show hide
        if ($(this).scrollTop() > 400) {
            $('.btn-gotop').addClass("show");
        } else {
            $('.btn-gotop').removeClass("show");
        }
        //#endregion



        var $header = $("header");
        var scroll = $(window).scrollTop();
        if (scroll <= 0) {
            $header.removeClass("slideToHide").addClass('slideToShow');
        } else {
            if (scroll > position_pagescroll) {
                //scrollDown
                $header.removeClass("slideToShow").addClass('slideToHide');
            } else {
                //scrollUp
                $header.removeClass("slideToHide").addClass('slideToShow');
            }
        }
        position_pagescroll = scroll;



        ShowWave();
    });

    //Top Hamburger
    $(".hamburger").click(function () {
        var $this = $(this), $body = $("body"), $nav = $("nav"), $header = $("header");
        $(".hamburger").toggleClass("is-active");
        $body.toggleClass("hamburger-is-active");
        $header.toggleClass("header--open");

        $nav.removeClass("in-active");
        if ($nav.hasClass("is-active")) {
            $nav.addClass("in-active");
            setTimeout(function () {
                $nav.removeClass("in-active").removeClass("is-active");
            }, 1000);
        } else {
            $nav.addClass("is-active");
        }


        $(".main_menu >ul > li").removeClass("active");
    });


    //#region header submenu animation
    var $menu = $(".main_menu > ul > li");
    $menu.mouseenter(function () {
        if (GetWindowWidth() < 1218)
            return;

        var $this = $(this);
        var isSubMenu = $this.children("a").attr("data-issubmenu");

        if (isSubMenu && isSubMenu == "true")
            clearTimeout(timeoutClass);

        $menu.removeClass("active");
        timeoutClass2 = setTimeout(function () {
            $this.removeClass("inactive").addClass("active");
        }, 100);

    });
    $menu.mouseleave(function () {
        if (GetWindowWidth() < 1218)
            return;

        _hidesubmenu($(this));
    });
    var timeoutClass;
    var timeoutClass2;
    var _hidesubmenu = function (e) {
        clearTimeout(timeoutClass2);
        if (e.length > 0) {
            var $menu__dropdown = e;
            var switchClass_array = ["active", "inactive"];
            if ($menu__dropdown.hasClass(switchClass_array[0])) {
                $menu__dropdown.addClass(switchClass_array[1]);
                timeoutClass = setTimeout(function () {
                    $menu__dropdown.removeClass(switchClass_array[0]).removeClass(switchClass_array[1]);
                }, 200);
            }
        }
    }

    //#endregion

    //#region header submenu animation mobile
    $("a[data-issubmenu='true']").click(function () {
        var $this = $(this);
        $(".main_menu >ul > li").not($this.parent()).removeClass("active");
        $this.parent().removeClass("inactive").toggleClass("active");
    });
    //#endregion
});

function GoTop() {
    $('html,body').animate({ scrollTop: 0 }, 1000, 'easeOutQuart');
}

//#region custom element parallex
var pagetitle_length = 0;
function renderPageTitle() {
    var english = /^[A-Za-z0-9]*$/;
    var speed = 0.03;
    var $pageTitle__parallex = $("._pageTitle__parallex");
    if ($pageTitle__parallex && $pageTitle__parallex.length > 0) {
        $.each($pageTitle__parallex, function () {
            var $this = $(this);
            var isEnglish = english.test($this.text().replace(/\s/g, ''));

            if (isEnglish) {
                //英文字母
                var _pageTitle__words = $this.text().trim().split(" ");
                var _pageTitle__chars_whole = $this.text().replace(/\s/g, '').split('');

                $this.empty();
                var html = "";
                for (var s = 0; s < _pageTitle__words.length; s++) {
                    var _pageTitle__chars = _pageTitle__words[s].replace(/\s/g, '').split('');
                    pagetitle_length = _pageTitle__chars_whole.length <= 3 ? 5 : _pageTitle__chars_whole.length;

                    for (var i = 0; i < _pageTitle__chars.length; i++) {
                        var index = (Math.floor(Math.random() * pagetitle_length) + 1);
                        var classname = "parallex_object" + index.toString(),
                            speed_range = (speed * index) * 1000,
                            direction = (Math.floor(Math.random() * 2) + 1) == 1 ? "down" : "up";

                        html += '<span class="parallex parallex_object ' + classname + '" data-speed="' + speed_range + '" data-direction="' + direction + '">' + _pageTitle__chars[i] + '</span>';
                    }
                    html += "&nbsp;";
                }
                $this.append(html.substr(0, html.lastIndexOf("&nbsp;")));
            } else {
                //中文
                var _pageTitle__chars = $this.text().replace(/\s/g, '').split('');
                pagetitle_length = _pageTitle__chars.length <= 3 ? 5 : _pageTitle__chars.length;

                $this.empty();

                var html = "";
                for (var i = 0; i < _pageTitle__chars.length; i++) {
                    var index = (Math.floor(Math.random() * pagetitle_length) + 1);
                    var classname = "parallex_object" + index.toString(),
                        speed_range = (speed * index) * 1000,
                        direction = (Math.floor(Math.random() * 2) + 1) == 1 ? "down" : "up";

                    html += '<span class="parallex parallex_object ' + classname + '" data-speed="' + speed_range + '" data-direction="' + direction + '">' + _pageTitle__chars[i] + '</span>';
                }
                $this.append(html);
            }
        });
    }

    var $wave1 = $(".wave1");
    if ($wave1 && $wave1.length > 0) {
        $.each($wave1, function () {
            var $this = $(this);
            var isEnglish = english.test($this.text().replace(/\s/g, ''));

            if (isEnglish) {
                //英文字母
                var _wave1__words = $this.text().trim().split(" ");

                $this.empty();

                var html = "";

                for (var s = 0; s < _wave1__words.length; s++) {
                    var _wave1__chars = _wave1__words[s].replace(/\s/g, '').split('');
                    for (var i = 0; i < _wave1__chars.length; i++) {
                        html += '<span>' + _wave1__chars[i] + '</span>';
                    }
                    html += '<span>&nbsp;</span>';
                }
                $this.append(html.substr(0, html.lastIndexOf("<span>&nbsp;</span>")));
            } else {
                //中文
                var _wave1__chars = $this.text().replace(/\s/g, '').split('');
                $this.empty();

                var html = "";
                for (var i = 0; i < _wave1__chars.length; i++) {
                    html += '<span>' + _wave1__chars[i] + '</span>';
                }
                $this.append(html);
            }
        });


    }
}
function animationIndexPage(loadtype) {
    var scrolltop = loadtype == "load" ? $(window).scrollTop() > 0 ? 0 : 400 : $(window).scrollTop();
  
    const animate_object = function () {
        $.each($(".parallex_object"), function () {
            var $this = $(this);
            var isGrayScale = parseInt($this.attr("data-isgrayscale")) == 1 ? true : false,
                speed = parseInt($this.attr("data-speed")) / 1000,
                direction = $this.attr("data-direction") == "down" ? 1 : -1,
                _this_offsettop = parseInt($this.attr("data-offsettop"));

            var win_top = ((scrolltop - _this_offsettop) * speed) * direction;

            if (isGrayScale) {
                var grayscale_rate = 1 - (0.0025 * (scrolltop - _this_offsettop + 200));
                $this.css({
                    "-webkit-transform": "translate(0," + win_top + "px)",
                    "transform": "translate(0," + win_top + "px)",
                    "filter": "grayscale(" + grayscale_rate + ")"
                });
            } else {
                $this.css({
                    "-webkit-transform": "translate(0," + win_top + "px)",
                    "transform": "translate(0," + win_top + "px)"
                });
            }

        });
    };

    //物件浮動(動畫)
    if (loadtype == "load") {        
        $.each($(".parallex_object"), function () {
            var $this = $(this);
            var parallex_box_offsetTop = $this.closest(".parallex_box").length > 0 ? $this.closest(".parallex_box").offset().top : 0;
            
            $this.attr("data-offsettop", parallex_box_offsetTop);
        }).promise().done(function () {
            animate_object();
        });
    } else {
        if ($("body").hasClass(body_finished_class)) {
            animate_object();
        }
    }
}
//#endregion

//wave animation
function ShowWave() {
    var _window_scrollTop = $(window).scrollTop();
    var $wave = $(".wave:not(.active)");
    var _win_height = $(window).height();

    if (IsLoadFinished) {

        $.each($wave, function (i, e) {
            var _waveTop_from_window = $(e).offset().top - _window_scrollTop;
            if (_waveTop_from_window < (_win_height * 0.85)) {
                $(e).addClass("active");
            }
        });
    }
}

//$(".latest__section") animation
function latestSectionAnimation() {
    var win_scrollTop = $(window).scrollTop();
    if ($(latestSectionClassName).length > 0) {
        var $latest__section = $($(latestSectionClassName)[0]);
        var animation_distance = ($latest__section.offset().top + $latest__section.outerHeight(true)) - 160;

        if (IsLoadFinished) {
            if (win_scrollTop > animation_distance)
                $latest__section.removeClass("animation");
            else
                $latest__section.addClass("animation");
        }
    }
}

//get gquery string
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//check isIE
function isIE() {

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var result = false;
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
        //alert(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
        result = true;
    }
    else  // If another browser, return 0
    {
        //alert('otherbrowser');
        result = false;
    }

    return result;
}

//check isMobile
function isMobile() {
    var isMobile = false; //initiate as false
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    return isMobile;
}

//get window width
function GetWindowWidth() {
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        //'Its Safari'
        windowWidth = document.documentElement.clientWidth;
    }
    return windowWidth;
}


var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-110px";
  }
  prevScrollpos = currentScrollPos;
}