(function () {

    // Game system core

    var $game = window.$game = {
        _mode: null,

        busy: false,
    };

    $game.save = function () {
        return {
            mode: this._mode,
            map: this.map.save(),
            dialog: this.dialog.save(),
        };
    };

    $game.load = function (data) {
        this.mode(data.mode);

        this.map.load(data.map);
        this.dialog.load(data.dialog);
    };

    $game.mode = function (name, a1, a2, a3) {
        if (this.busy) return;

        switch (name) {
            case "dialog":
                this.map.show(false);
                this.dialog.goto(null, a1);
                break;
            case "map":
                this.map.show(true);
                this.dialog.show(false);
                break;
            default:
                console.error("Invalid mode '" + name + "'");
        }

        this._mode = name;
    };

    // Map system

    var MAP_BODY, MAP_IMAGE, MAP_CHP_MENU, MAP_CHP_LIST;

    var map = $game.map = {
        _areas: {},
    };

    map.save = function () {
        return {

        };
    };

    map.load = function (data) {

    };

    map.addArea = function (name, pos, menu) {
        var area = this._areas[name] = {
            name: name,
            pos: pos.slice(),
            menu: menu.slice(),
        };
    };

    map.show = function (show) {
        if ($game.busy) return;

        if (show && !this._init) {
            this._init = true;

            for (var k in this._areas) {
                if (!this._areas.hasOwnProperty(k)) continue;

                var area = this._areas[k];
                var dom = area.elem = $("<div></div>");

                dom.appendTo(MAP_BODY);
                dom.addClass('map-area');

                dom.css('left', area.pos[0] + '%');
                dom.css('top', area.pos[1] + '%');
                dom.css('width', area.pos[2] + '%');
                dom.css('height', area.pos[3] + '%');
                
                dom.click(this._showChapterMenu.bind(this, area));
            }
        };

        MAP_BODY.css('display', show ? '' : 'none');
    };

    map._showChapterMenu = function (data) {
        var item_tpl = $("#map-chapter-menu-item").html();

        MAP_CHP_LIST.html(null);

        for (var i = 0; i < data.menu.length; i++) {
            var item = data.menu[i];

            var dom = $(item_tpl);
            dom.appendTo(MAP_CHP_LIST);

            var cc_img = $(".cc-img", dom);
            var cc_text = $(".cc-text", dom);

            cc_text.html(item.name);
            if (item.icon) {
                cc_img.attr('src', item.icon);
            }

            cc_img.click(this._selectChapter.bind(this, item));
        }

        MAP_CHP_MENU.modal('show');
    };

    map._selectChapter = function (data) {
        MAP_CHP_MENU.modal('hide');

        if (data.dialog) {
            $game.mode("dialog", data.dialog);
        }
    };

    // Dialog system

    var BLANK_IMG, DG_TEXT, DG_NAME, DG_IMAGE, DG_SCENE, DG_FADE, DG_DIALOG, DG_NEXTBTN;

    var dialog = $game.dialog = {
        _stages: {},
        _actions: {},

        _index: 0,
        _stage: null,
    };

    dialog.save = function () {
        return {
            index: this._index,
            stage: this._stage.name,

            image: DG_IMAGE.attr('src'),
            scene: $U.getBgImage(DG_SCENE),
            text: DG_TEXT.html(),
            name: DG_NAME.html(),
        };
    };

    dialog.load = function (data) {
        this._index = data.index;
        this._stage = this._stages[data.stage];

        if (data.image) {
            DG_IMAGE.attr('src', data.image);
            DG_IMAGE.removeClass('dg-hidden');
        } else {
            DG_IMAGE.addClass('dg-hidden');
        }

        $U.setBgImage(DG_SCENE, data.scene);

        DG_TEXT.html(data.text);

        if (data.name) {
            DG_NAME.html(data.name);
            DG_NAME.css('display', '');
        } else {
            DG_NAME.css('display', 'none');
        }
    };

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
    };

    dialog.setAction = function (name, func) {
        this._actions[name] = func;
    };

    dialog.advance = function () {
        if (!this._stage || $game.busy) return;

        var cmd;

        _loop:
        while (cmd = this._stage.data[this._index]) {
            this._index++;
            
            switch (cmd.do) {
                case "say":
                    DG_TEXT.html(cmd.text);

                    if (cmd.name) {
                        DG_NAME.css('display', '');
                        DG_NAME.html(cmd.name);
                    } else {
                        DG_NAME.css('display', 'none');
                    }
                    break _loop;

                case "image":
                    var oldUrl = DG_IMAGE.attr('src');
                    var newUrl = cmd.url || BLANK_IMG;

                    if (cmd.now
                    && oldUrl != BLANK_IMG
                    && newUrl != BLANK_IMG) {
                        DG_IMAGE.attr('src', newUrl);
                        break;
                    } else {
                        var def = $U.always({ self: this, url: newUrl });

                        if (oldUrl != BLANK_IMG) {
                            def = def.then(function (p) {
                                DG_IMAGE.addClass('dg-hidden');
                                return $U.delay(500, p);
                            });
                        }

                        if (newUrl != BLANK_IMG) {
                            def = def.then(function (p) {
                                DG_IMAGE.attr('src', p.url);
                                DG_IMAGE.removeClass('dg-hidden');
                                return $U.delay(500, p);
                            });
                        }

                        def.then(function (p) {
                            $game.busy = false;
                            p.self.advance();
                        });

                        $game.busy = true;
                        break _loop;
                    }

                case "scene":
                    var def = $U.always({ url: cmd.url, self: this });

                    def.then(function (p) {
                        DG_FADE.addClass('dg-faded');
                        return $U.delay(500, p);
                    }).then(function (p) {
                        DG_FADE.removeClass('dg-faded');
                        $U.setBgImage(DG_SCENE, p.url);
                        return $U.delay(500, p);
                    }).then(function (p) {
                        $game.busy = false;
                        p.self.advance();
                    });

                    $game.busy = true;
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

        DG_NEXTBTN.css('display', cmd ? '' : 'none');
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
    };

    dialog.goto = function (label, stage) {
        if ($game.busy) return;

        this._goto(label, stage);
        this.advance();
    };

    dialog.show = function (show) {
        if (!this._stage || $game.busy) return;

        DG_DIALOG.css('display', show ? '' : 'none');
        DG_SCENE.css('display', show ? '' : 'none');
    };

    // Default dialog actions

    dialog.setAction("show", function () {
        this.dialog.show(true);
    });

    dialog.setAction("hide", function () {
        this.dialog.show(false);
    });

    dialog.setAction("ChapterDone", function () {
        this.mode("map");
    });

    // Setup code

    $(document).ready(function () {
        // Element references

        DG_TEXT = $(".dg-text span.text");
        DG_NAME = $(".dg-text span.name");

        DG_IMAGE = $(".dg-image img");
        DG_SCENE = $(".dialog-scene");
        DG_FADE = $(".dialog-fade");

        DG_DIALOG = $(".dialog-box");
        DG_NEXTBTN = $(".dialog-box a.next-btn");

        BLANK_IMG = DG_IMAGE.attr('src');
        DG_IMAGE.addClass('dg-hidden');

        MAP_BODY = $(".map-body");
        MAP_IMAGE = $(".map-body img.map-bg");

        MAP_CHP_MENU = $("#map-chapter-menu");
        MAP_CHP_LIST = $("#map-chapter-menu .ch-list");

        // Dialog setup

        DG_NEXTBTN.click(function () {
            $game.dialog.advance();
        });

        // Base setup

        $(".game .play-btn").click(function () {
            $(this).css('display', 'none');

            // TODO: Start logic
            $game.mode("map");
        });

        DG_SCENE.css('display', 'none');
        DG_DIALOG.css('display', 'none');
        MAP_BODY.css('display', 'none');
    });

}).call(this);