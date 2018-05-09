(function () {

    var $game = window.$game = {};

    var dialog = $game.dialog = {
        _stages: {},
        _actions: {},

        _index: 0,
        _stage: null,
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
        if (!this._stage) return;

        var _text = $(".dg-text span.text");
        var _name = $(".dg-text span.name");

        var _image = $(".dg-image img");
        var _scene = $(".dialog-scene");

        var _nextbtn = $(".dg-text a.next-btn");

        var cmd, data;

        _loop:
        while (cmd = this._stage.data[this._index]) {
            this._index++;
                
            switch (cmd.do) {
                case "say":
                    _text.html(cmd.text);

                    if (cmd.name) {
                        _name.css('display', '');
                        _name.html(cmd.name);
                    } else {
                        _name.css('display', 'none');
                    }
                    break _loop;

                case "image":
                    _image.attr('src', cmd.url || this.BLANK_IMG);
                    break;

                case "scene":
                    $U.setBgImage(_scene, cmd.url);
                    break;

                case "goto":
                    this._goto(cmd.label, cmd.stage);
                    break;

                case "action":
                    if (data = this._actions[cmd.name]) {
                        data.call($game);
                    } else if(cmd.name) {
                        console.error("Invalid action '" + cmd.name + "'");
                    }

                    if (cmd.hide) {
                        this.show(false);
                    }
                    break;
            }
        }

        _nextbtn.css('display', cmd ? '' : 'none');
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
        this._goto(label, stage);
        this.advance();
    }

    dialog.show = function (show) {
        if (!this._stage) return;

        var _dialog = $(".dialog-box");
        _dialog.css('display', show ? '' : 'none');
    }

    dialog.begin = function (stage) {
        this.goto(null, stage);
        this.show(true);
    }

    $(document).ready(function () {
        $(".dg-text a.next-btn").click(function () {
            dialog.advance();
        });

        $(".game .play-btn").click(function () {
            $(this).css('display', 'none');

            dialog.begin('intro');
        });

        dialog.BLANK_IMG = $(".dg-image img").attr('src');
    });

}).call(this);