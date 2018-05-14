(function () {

    var MN_NEWGAME, MN_SAVEGAME;
    var GM_WELCOME, GM_PLAYBTN;
    var MAP_BODY, MAP_IMAGE, MAP_CHP_MENU, MAP_CHP_LIST;
    var BLANK_IMG, DG_TEXT, DG_NAME, DG_IMAGE, DG_SCENE, DG_FADE, DG_FADETXT, DG_DIALOG, DG_NEXTBTN;
    var QST_IFRAME, QST_LOADING;

    // Game system core

    var $game = window.$game = {
        _mode: null,

        busy: false,
    };

    $game.new = function () {
        this.mode("map");
    };

    $game.reset = function () {
        this.mode("welcome");
    }

    $game.save = function () {
        return {
            mode: this._mode,

            map: this.map.save(),
            dialog: this.dialog.save(),
            quest: this.quest.save(),
        };
    };

    $game.load = function (data) {
        if (!data) return;

        this.mode(data.mode);

        this.map.load(data.map);
        this.dialog.load(data.dialog);
        this.quest.load(data.quest);

        this.mode(data.mode);
    };

    $game.serverSave = function (erase) {
        var data = erase ? "" : JSON.stringify(this.save());

        $("#game-save-data").text(data);

        $.ajax({
            method: 'post',
            url: '/Manage/UpdateSaveData',
            data: { data: data },
        });
    };

    $game.serverLoad = function () {
        var data = $("#game-save-data").text();

        if (data.length > 0) {
            console.log("load now");
            this.load(JSON.parse(data));
        }
    }

    $game.mode = function (name, arg) {
        if (this.busy) return;

        switch (name) {
            case "dialog":
                this.map.show(false);
                this.quest.begin(null);
                this._showWelcome(false);

                if (arg !== undefined) {
                    this.dialog.goto(null, arg);
                } else {
                    this.dialog.show(true);
                }
                break;
            case "map":
                this.dialog.show(false);
                this.quest.begin(null);
                this._showWelcome(false);

                this.map.show(true);
                break;
            case "welcome":
                this.map.show(false);
                this.dialog.show(false);
                this.quest.begin(null);

                this._showWelcome(true);
                break;
            case "quest":
                this.map.show(false);
                this.dialog.show(false);
                this._showWelcome(false);

                if (arg !== undefined) {
                    this.quest.begin(arg);
                } else {
                    this.quest.show(true);
                }
                break;
            default:
                console.error("Invalid mode '" + name + "'");
                break;
        }

        this._mode = name;
    };

    $game._showWelcome = function (show) {
        GM_WELCOME.css('display', show ? '' : 'none');
    }

    // Map system

    var map = $game.map = {
        _areas: {},
        _blocked: {},
    };

    map.save = function () {
        return {
            blocked: $.extend({}, this._blocked),
        };
    };

    map.load = function (data) {
        this._blocked = $.extend({}, data.blocked);

        for (var k in this._areas) {
            if (!this._areas.hasOwnProperty(k)) continue;

            this.setBlocked(k, this._blocked[k]);
        }
    };

    map.addArea = function (name, pos, title, menu) {
        var area = this._areas[name] = {
            name: name,
            pos: pos.slice(),
            title: title,
            menu: menu.slice(),
        };

        this._blocked[name] = true;
    };

    map.show = function (show) {
        if ($game.busy) return;

        if (show && !this._init) {
            this._init = true;

            var item_tpl = $("#map-area-tpl").html();

            for (var k in this._areas) {
                if (!this._areas.hasOwnProperty(k)) continue;

                var area = this._areas[k];
                var dom = area.elem = $(item_tpl);
                dom.appendTo(MAP_BODY);

                if (this._blocked[area.name]) {
                    dom.addClass('blocked');
                }

                dom.css('left', area.pos[0] + '%');
                dom.css('top', area.pos[1] + '%');
                dom.css('width', area.pos[2] + '%');
                dom.css('height', area.pos[3] + '%');
                
                dom.click(this._showChapterMenu.bind(this, area));
            }
        };

        MAP_BODY.css('display', show ? '' : 'none');
    };

    map.setBlocked = function (area, block) {
        var _area = this._areas[area];
        if (!_area) {
            console.error("Invalid map area '" + area + "'");
            return;
        }

        this._blocked[area] = !!block;
        if (_area.elem) {
            _area.elem.toggleClass('blocked', block);
        }
    }

    map._showChapterMenu = function (data) {
        if (this._blocked[data.name]) return;

        var item_tpl = $("#map-chapter-menu-tpl").html();

        MAP_CHP_LIST.html(null);

        var ch_title = $(".ch-title", MAP_CHP_MENU);
        ch_title.html(data.title);

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

    var dialog = $game.dialog = {
        _stages: {},
        _actions: {},

        _index: 0,
        _stage: null,
    };

    dialog.save = function () {
        return {
            index: this._index,
            stage: this._stage ? this._stage.name : null,

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

                        $game.busy = true;

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

                        break _loop;
                    }

                case "scene":
                    var def = $U.always({ url: cmd.url, text: cmd.text, self: this });

                    $game.busy = true;

                    def = def.then(function (p) {
                        DG_FADETXT.html(p.text || null);
                        DG_FADE.addClass('dg-faded');
                        return $U.delay(500, p);
                    });

                    if (cmd.text) {
                        def = def.then(function (p) {
                            return $U.delay(1000, p);
                        });
                    }

                    def.then(function (p) {
                        DG_FADE.removeClass('dg-faded');
                        $U.setBgImage(DG_SCENE, p.url);
                        return $U.delay(500, p);
                    }).then(function (p) {
                        console.log("$game", $game);
                        $game.busy = false;
                        p.self.advance();
                    });

                    break _loop;

                case "goto":
                    this._goto(cmd.label, cmd.stage);
                    break;

                case "action":
                    var data;
                    
                    if (data = this._actions[cmd.name]) {
                        if (data.apply($game, cmd.args)) break _loop;
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

    dialog.setAction("ChapterDone", function (prev, next) {
        if (next) {
            this.map.setBlocked(next, false);
        }

        this.mode("map");
    });

    dialog.setAction("StartQuest", function (url) {
        this.mode("quest", url);
        return true;
    });

    // Quest system

    var quest = $game.quest = {
        _isload: false,

        _url: null,
    };

    quest.save = function () {
        return {
            url: this._url,
        };
    };

    quest.load = function (data) {
        this.begin(data.url);
    };

    quest.begin = function (url) {
        if ($game.busy) return;

        if (url) {
            $game.busy = true;
            this._isload = true;
            this._url = url;

            QST_IFRAME.attr('src', url);
            QST_LOADING.css('display', '');
        } else {
            this._url = null;

            QST_IFRAME.attr('src', 'about:blank');
            QST_IFRAME.css('display', 'none');
            QST_LOADING.css('display', 'none');
        }
    };

    quest.show = function (show) {
        if (!this._url || $game.busy) return;

        QST_IFRAME.css('display', show ? '' : 'none');
    };

    quest._onLoad = function () {
        if (this._isload) {
            $game.busy = false;
            this._isload = false;

            QST_IFRAME.css('display', '');
            QST_LOADING.css('display', 'none');
        }
    };

    quest._onMessage = function (data) {
        switch (data) {
            case "quest-ok":
                $game.mode("dialog");
                $game.dialog.advance();
                break;
        }
    };

    // Setup code

    $(document).ready(function () {
        // Element references

        MN_NEWGAME = $("a.newgame-btn");
        MN_SAVEGAME = $("a.savegame-btn");

        GM_WELCOME = $(".game-welcome");
        GM_PLAYBTN = $(".game-welcome .play-btn");

        DG_TEXT = $(".dg-text span.text");
        DG_NAME = $(".dg-text span.name");

        DG_IMAGE = $(".dg-image img");
        DG_SCENE = $(".dialog-scene");

        DG_FADE = $(".dialog-fade");
        DG_FADETXT = $(".dialog-fade .fade-text");

        DG_DIALOG = $(".dialog-box");
        DG_NEXTBTN = $(".dialog-box a.next-btn");

        BLANK_IMG = DG_IMAGE.attr('src');
        DG_IMAGE.addClass('dg-hidden');

        MAP_BODY = $(".map-body");
        MAP_IMAGE = $(".map-body img.map-bg");

        MAP_CHP_MENU = $("#map-chapter-menu");
        MAP_CHP_LIST = $("#map-chapter-menu .ch-list");

        QST_IFRAME = $("iframe.quest-embed");
        QST_LOADING = $(".quest-loading");

        // Dialog setup

        DG_NEXTBTN.click(function () {
            $game.dialog.advance();
        });

        // Quest setup

        QST_IFRAME.on('load', function () {
            $game.quest._onLoad();
        });

        $(window).on('message', function (e) {
            var data = e.originalEvent.data;
            $game.quest._onMessage(data);
        });

        // Base setup

        GM_PLAYBTN.click(function () {
            var saved = $("#game-save-data").text();

            if (saved.length > 0
            && confirm("Загрузить ранее сохранённый прогресс?")) {
                $game.serverLoad();
            } else {
                $game.new();
                $game.serverSave(true);
            }
        });

        MN_NEWGAME.click(function () {
            if (confirm("Действительно начать игру заново?")) {
                $game.reset();
                $game.serverSave(true);
            }
        });

        MN_SAVEGAME.click(function () {
            $game.serverSave(false);
            alert("Ваш игровой прогресс сохранён!");
        });
    });

}).call(this);