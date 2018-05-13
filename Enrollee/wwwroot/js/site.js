(function () {

    var util = window.$U = {};

    util.getBgImage = function (target) {
        var url = $(target).css('background-image');
        var match = url.match(/url\("(.+)"\)/i);
        return (match && match[1]) ? match[1] : null;
    }

    util.setBgImage = function (target, url) {
        if (url) {
            url = 'url("' + url.replace('"', '%22') + '")';
            $(target).css('background-image', url);
        } else {
            $(target).css('background-image', 'none');
        }
    }

    util.delay = function (time, data) {
        return $.Deferred(function (defer) {
            setTimeout(defer.resolve.bind(null, data), time);
        });
    }

    util.always = function (data) {
        return $.Deferred(function (defer) {
            defer.resolve.call(null, data);
        });
    }

}).call(this);

$(document).ready(function () {
    $("div.has-bg img.is-bg").each(function () {
        var _obj = $(this);

        $U.setBgImage(_obj.parent(), _obj.attr('src'));
        _obj.remove();
    });

    $(".system-menu > a").each(function () {
        $(this).attr('href', 'javascript:void(0)');
    });

    var button = $("a.fullscreen-btn");
    button.click(function () {
        if (document.fullscreenElement
        || document.webkitFullscreenElement
        || document.mozFullScreenElement
        || document.msFullscreenElement) {

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }

        } else {

            var sel = $(this).attr('data-target');
            var obj = document.getElementById(sel);

            if (obj.requestFullscreen) {
                obj.requestFullscreen();
            } else if (obj.mozRequestFullScreen) {
                obj.mozRequestFullScreen();
            } else if (obj.webkitRequestFullscreen) {
                obj.webkitRequestFullscreen();
            } else if (obj.msRequestFullscreen) {
                obj.msRequestFullscreen();
            }

        }
    });
});
