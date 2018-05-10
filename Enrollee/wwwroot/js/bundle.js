var getComments = function () {
    var page = $(this).attr('data-page');
    $.ajax({
        url: "/Comments/GetComments",
        type: "GET",
        data: { page: page },
        success: function (data) {
            $("#CommentListSegment").html(data);
        },
        error: function () {
            alert('Something happened!');
        }
    });
};

$(document).ready(function () {
    $('#SubmitComment').click(function () {
        var text = $("#CommentText").val();
        $.ajax({
            url: '/Comments/CreateFromPartial',
            data: { data: text },
            type: 'POST',
            success: function (obj) {
                $("#CommentText").val("");
                getComments();
            },
            error: function (obj) {
                alert('Something happened');
            }
        });
    });
});

$('#CommentListSegment').on('click', '.SwitchPageBtn', getComments);
(function () {

    var BLANK_IMG, UI_TEXT, UI_NAME, UI_IMAGE, UI_SCENE, UI_FADE, UI_DIALOG, UI_NEXTBTN;

    var $game = window.$game = {};

    var dialog = $game.dialog = {
        _stages: {},
        _actions: {},

        _index: 0,
        _stage: null,

        _busy: false,
    };

    dialog.setStage = function (name, data) {
        var labels = {};
        for (var i = 0; i < data.length; i++) {
            if (data[i].id) {
                labels[data[i].id] = i;
            }
        }

        this._stages[name] = {
            data: data.slice(),
            labels: labels,
        };
    }

    dialog.setAction = function (name, func) {
        this._actions[name] = func;
    }

    dialog.advance = function () {
        if (!this._stage || this._busy) return;

        var cmd;

        _loop:
        while (cmd = this._stage.data[this._index]) {
            this._index++;
            
            switch (cmd.do) {
                case "say":
                    UI_TEXT.html(cmd.text);

                    if (cmd.name) {
                        UI_NAME.css('display', '');
                        UI_NAME.html(cmd.name);
                    } else {
                        UI_NAME.css('display', 'none');
                    }
                    break _loop;

                case "image":
                    var oldUrl = UI_IMAGE.attr('src');
                    var newUrl = cmd.url || BLANK_IMG;
                    var def = $U.always({ self: this, url: newUrl });

                    if (oldUrl != BLANK_IMG) {
                        def = def.then(function (p) {
                            UI_IMAGE.addClass('dg-hidden');
                            return $U.delay(500, p);
                        });
                    }

                    if (newUrl != BLANK_IMG) {
                        def = def.then(function (p) {
                            UI_IMAGE.attr('src', p.url);
                            UI_IMAGE.removeClass('dg-hidden');
                            return $U.delay(500, p);
                        });
                    }

                    def.then(function (p) {
                        p.self._busy = false;
                        p.self.advance();
                    });

                    this._busy = true;
                    break _loop;

                case "scene":
                    var def = $U.always({ url: cmd.url, self: this });

                    def.then(function (p) {
                        UI_FADE.addClass('dg-faded');
                        return $U.delay(500, p);
                    }).then(function (p) {
                        UI_FADE.removeClass('dg-faded');
                        $U.setBgImage(UI_SCENE, p.url);
                        return $U.delay(500, p);
                    }).then(function (p) {
                        p.self._busy = false;
                        p.self.advance();
                    });

                    this._busy = true;
                    break _loop;

                case "goto":
                    this._goto(cmd.label, cmd.stage);
                    break;

                case "action":
                    var data;
                    
                    if (data = this._actions[cmd.name]) {
                        data.call($game);
                    } else if(cmd.name) {
                        console.error("Invalid action '" + cmd.name + "'");
                    }

                    if (cmd.hide) {
                        this.show(false);
                    } else if (cmd.show) {
                        this.show(true);
                    }
                    break;
            }
        }

        UI_NEXTBTN.css('display', cmd ? '' : 'none');
    };

    dialog._goto = function (label, stage) {
        if (stage) {
            var _stage = this._stages[stage];
            if (!_stage) {
                console.error("Invalid stage '" + stage + "'");
                return;
            }

            this._stage = _stage;
        }

        if (label) {
            var _label = this._stage.labels[label];
            if (!_label) {
                console.error("Invalid label '" + label + "'");
                return;
            }

            this._index = _label;
        } else {
            this._index = 0;
        }
    }

    dialog.goto = function (label, stage) {
        if (this._busy) return;

        this._goto(label, stage);
        this.advance();
    }

    dialog.show = function (show) {
        if (!this._stage || this._busy) return;

        UI_DIALOG.css('display', show ? '' : 'none');
    }

    $(document).ready(function () {
        UI_TEXT = $(".dg-text span.text");
        UI_NAME = $(".dg-text span.name");

        UI_IMAGE = $(".dg-image img");
        UI_SCENE = $(".dialog-scene");
        UI_FADE = $(".dialog-fade");

        UI_DIALOG = $(".dialog-box");
        UI_NEXTBTN = $(".dialog-box a.next-btn");

        $(".dialog-box a.next-btn").click(function () {
            dialog.advance();
        });

        $(".game .play-btn").click(function () {
            $(this).css('display', 'none');

            dialog.goto(null, 'intro');
        });
        
        BLANK_IMG = UI_IMAGE.attr('src');
        UI_IMAGE.addClass('dg-hidden');
    });

}).call(this);
(function () {

    var util = window.$U = {};

    util.setBgImage = function (target, url) {
        var _obj = $(target);

        if (url) {
            url = "url('" + url.replace("'", "\\'") + "')";
            _obj.css('background-image', url);
        } else {
            _obj.css('background-image', 'none');
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
    $("div.has-bg img").each(function () {
        var _obj = $(this);

        $U.setBgImage(_obj.parent(), _obj.attr('src'));
        _obj.remove();
    });

    var button = $(".fullscreen-btn > a");
    button.attr('href', 'javascript:void(0)');
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