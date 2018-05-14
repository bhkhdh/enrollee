// Main game script here

$game.dialog.setStage('start-here', [
    { do: "scene", url: null },
    { do: "action", name: "show" },

    { do: "say", name: "Me", text: "u mom gay lol" },

    { do: "action", name: "ChapterDone", args: ["test", "stuff"] },
]);

$game.dialog.setStage('intro', [
    { do: "scene", url: "/images/game/scene/scene-1.png" },
    { do: "action", name: "show" },

    { do: "say", text: "This is some intro text" },
    { do: "say", text: "More text here" },

    { do: "goto", stage: "test-1" },
]);


$game.dialog.setStage('test-1', [
    { do: "scene", url: "/images/game/scene/scene-2.png", text: "[memes]" },
    { do: "action", name: "show" },

    { do: "image", url: "/images/game/dialog/person-1.png" },
    { do: "say", name: "Person", text: "Hello!" },

    { do: "action", name: "StartQuest", args: ["/Quest/Game4"] },

    { do: "say", name: "Person", text: "Here should be some content" },

    { do: "image", url: null },
    { do: "say", text: "The End™" },

    { do: "action", name: "hide" },
    { do: "scene", url: null },

    { do: "action", name: "ChapterDone", args: ["stuff", null] },
]);

$game.map.addArea('test', [25.5, 5.4, 28.0, 17.8], "Testing", [
    { name: "Start Dialog", dialog: "start-here" },
]);

$game.map.addArea('stuff', [41.6, 33.0, 21.0, 24.0], "Stuff Here", [
    { name: "Chapter 1", dialog: "intro" },
    { name: "Chapter 2", dialog: "test-1" },
]);

$game.map.addArea('memes', [36.0, 64.0, 38.5, 27.2], "Memes", [
    { name: "Chapter 1", dialog: "intro" },
    { name: "Chapter 2", dialog: "test-1" },
]);

$game.map.setBlocked('test', false);