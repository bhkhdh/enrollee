(function () {

    // Game system core

    var $game = window.$game = {
        _mode: null,
    };

    $game.save = function () {
        return {
            mode: this._mode,
            dialog: this.dialog.save(),
        };
    }

    $game.load = function (data) {
        this._mode = data.mode;

        this.dialog.load(data.dialog);
        if (data.mode == "dialog") {
            this.dialog.show(true);
        }
    }

    // Dialog system

    var BLANK_IMG, UI_TEXT, UI_NAME, UI_IMAGE, UI_SCENE, UI_FADE, UI_DIALOG, UI_NEXTBTN;

    var dialog = $game.dialog = {
        _stages: {},
        _actions: {},

        _index: 0,
        _stage: null,

        _busy: false,
    };

    dialog.save = function () {
        return {
            index: this._index,
            stage: this._stage.name,

            image: UI_IMAGE.attr('src'),
            scene: $U.getBgImage(UI_SCENE),
            text: UI_TEXT.html(),
            name: UI_NAME.html(),
        };
    }

    dialog.load = function (data) {
        this._index = data.index;
        this._stage = this._stages[data.stage];

        if (data.image) {
            UI_IMAGE.attr('src', data.image);
            UI_IMAGE.removeClass('dg-hidden');
        } else {
            UI_IMAGE.addClass('dg-hidden');
        }

        $U.setBgImage(UI_SCENE, data.scene);

        UI_TEXT.html(data.text);

        if (data.name) {
            UI_NAME.html(data.name);
            UI_NAME.css('display', '');
        } else {
            UI_NAME.css('display', 'none');
        }
    }

    dialog.setStage = function (name, data) {
        var labels = {};
        for (var i = 0; i < data.length; i++) {
            if (data[i].id) {
                labels[data[i].id] = i;
            }
        }

        this._stages[name] = {
            name: name,
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
                        data.apply($game, cmd.args);
                    } else if(cmd.name) {
                        console.error("Invalid action '" + cmd.name + "'");
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

        if (show && $game._mode == null) {
            $game._mode = "dialog";
        } else if (!show && $game.mode == "dialog") {
            $game._mode = null;
        }
    }

    // Default dialog actions

    dialog.setAction("show", function () {
        this.dialog.show(true);
    });

    dialog.setAction("hide", function () {
        this.dialog.show(false);
    });

    // Setup code

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