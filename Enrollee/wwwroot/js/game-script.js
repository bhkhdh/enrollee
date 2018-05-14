var CHR_YOU = "Саша";
var C_YOU_1 = "/images/game/dialog/boy1-1.png";
var C_YOU_2 = "/images/game/dialog/boy1-2.png";
var C_YOU_3 = "/images/game/dialog/boy1-3.png";

var CHR_MOTHER = "Мама";
var C_MOTHER_1 = "/images/game/dialog/mother1-1.png";

var CHR_FRIEND1 = "Максим";
var C_FRIEND1_1 = "/images/game/dialog/friend1-1.png";

var CHR_FRIEND2 = "Джей";
var C_FRIEND2_1 = "/images/game/dialog/friend2-1.png";

var CHR_FRIEND3 = "Ваня";
var C_FRIEND3_1 = null; // ** NO IMAGE!

var CHR_WOMAN1 = "Женщина с комиссии";
var C_WOMAN1_1 = "/images/game/dialog/woman1-1.png";
var C_WOMAN1_2 = "/images/game/dialog/woman1-2.png";
var C_WOMAN1_3 = "/images/game/dialog/woman1-3.png";

var CHR_TOGETHER1 = "Саша, Джей";
var C_TOGETHER1_1 = null; // ** Combine C_YOU_1 & C_FRIEND2_1 maybe?

var CHR_DEKAN = "Декан";
var C_DEKAN_1 = "/images/game/dialog/dekan1-1.png";

var CHR_PROFESSOR = "Александр Всеволодович";
var C_PROFESSOR_1 = "/images/game/dialog/professor1-1.png";

var SC_HOME = "/images/game/scene/home.png";
var SC_PARK = "/images/game/scene/park.png";
var SC_KHNUE1 = "/images/game/scene/khnue1.png";
var SC_KHNUE2 = "/images/game/scene/khnue2.png";
var SC_KHNUE3 = "/images/game/scene/khnue3.png";
var SC_LECTURE = "/images/game/scene/lecture.png"

var I_DOCUMENTS = "/images/game/misc/documents.png";



function scene(url, text) {
    return { do: "scene", url: url, text: text };
}
function image(url, now) {
    return { do: "image", url: url, now: !!now };
}
function say(text, name) {
    return { do: "say", name: name, text: text };
}
function action(name, args) {
    return { do: "action", name: name, args: args };
}
function goto(stage, label) {
    return { do: "goto", label: label, stage: stage };
}



$game.dialog.setStage('intro-1', [
    scene(SC_HOME, "(Дома)"),
    action("show"),

    image(null),
    say("[Мама приходит домой, сын ее встречает]"),

    image(C_YOU_1),
    say("Привет, мам. Как дела на работе?", CHR_YOU),

    image(C_MOTHER_1),
    say("Все хорошо! По дороге встретила подругу, рассказывала куда собирается поступать ее дочка, что у нее там список ВУЗов куда она хочет попасть.", CHR_MOTHER),

    image(C_YOU_2),
    say("Мам, я буду поступать в Хогвартс. *смеётся*", CHR_YOU),

    image(C_MOTHER_1),
    say("Сынок, а если серьезно, ты думал куда хочешь поступать? Ведь скоро подавать документы.", CHR_MOTHER),

    image(C_YOU_3),
    say("*задумался* Хм … я даже не знаю…", CHR_YOU),

    image(C_MOTHER_1),
    say("Просто подумай чем тебе нравится заниматься, кем тебе хочется быть. Посмотри сайты ВУЗов, может какой-то из них тебе понравится внешне. *улыбается*", CHR_MOTHER),

    image(C_YOU_1),
    say("Маам, ну ты что?", CHR_YOU),

    image(C_MOTHER_1),
    say("Почему нет, тебе ведь там учиться. Мне, например, очень понравился ХНЕУ им.С.Кузнеца, напомнил мне Биг Бен.", CHR_MOTHER),

    image(C_YOU_3),
    say("Ладно мам, там пацаны собрались, пойду к ним выйду.", CHR_YOU),

    goto("intro-2"),
]);

$game.dialog.setStage('intro-2', [
    scene(SC_PARK, "(На улице с друзьями)"),
    action("show"),

    image(C_YOU_1),
    say("Хеллоу гайз, как ваши дела? Скажите, это только у меня дома все разговоры про поступление или у вас тоже?", CHR_YOU),

    image(C_FRIEND1_1),
    say("Та не, я уже давно определился, хочу быть программистом. А у нас единственный специализированный ВУЗ где смогут нормально научить. Поэтому долго выбирать не пришлось.", CHR_FRIEND1),

    image(C_FRIEND2_1),
    say("Не слушай его [возмущается], я тоже буду учится на программиста, но в инжеке – это раньше так ХНЭУ назывался.", CHR_FRIEND2),
    say("Мой брат заканчивал этот универ, факультет «Экономической информатики» и сейчас он за границей.", CHR_FRIEND2),
    say("У них там вообще очень много фишек, одни из них, наверное самая классная, – французская программа двойного диплома, на магистратуре.", CHR_FRIEND2),

    image(C_FRIEND3_1),
    say("А я думаю, походу пойду в Мак работать, «Вільна каса, замовляйте будь ласка», у меня получается?", CHR_FRIEND3),
    say("Кстатии, там как раз с ХНЭУ рядом. По дороге на занятия будете заходить в гости. *смеётся*", CHR_FRIEND3),

    image(C_YOU_1),
    say("Надо будет погуглить все эти фишки ХНЭУ, но походу я уже знаю куда буду поступать", CHR_YOU),

    image(C_YOU_3, true),
    say("Ну а теперь давайте сменим уже эту тему, погнали поиграем…", CHR_YOU),

    goto("act1-1"),
]);

$game.dialog.setStage('act1-1', [
    scene(SC_HOME, "(Некоторое время спустя)"),
    action("show"),

    image(null),
    say("[Саша приходит домой, идёт заниматься своими делами]"),

    image(C_YOU_1),
    say("Фух, почти закончил собирать новый компьютер. Осталось только всё подключить…", CHR_YOU),

    action("StartQuest", ["/Quest/Game4"]),

    image(C_YOU_3, true),
	say("Ой, чуть не забыл! Я же хотел зайти на сайт ХНЕУ!", CHR_YOU),

    image(null),
    say("[Саша заходит на сайт ХНЭУ. Выбирает вкладку \"Абитуриент\"]"),

    image(C_YOU_1),
    say("Если поступать, то нужно узнать какие документы нам нужны с ребятами.", CHR_YOU),

    image(null),
    action("Overlay", [I_DOCUMENTS]),
    say("<i>Список документов</i>"),

    action("Overlay", [null]),

    goto("act1-2"),
]);

$game.dialog.setStage('act1-2', [
    scene(SC_HOME, "(На следующий день)"),
    action("show"),

    image(null),
    say("[Утром Саше приходит сообщение в Телеграмме от Джея]"),

    image(C_FRIEND2_1),
    say("Пойдем гулять, как раз съездим документы подадим. Ты ж не передумал?", CHR_FRIEND2),

    image(C_YOU_3),
    say("Поехали, я как раз вчера смотрел какие нужны.", CHR_YOU),

    image(C_FRIEND2_1),
    say("Скинь мне )", CHR_FRIEND2),

    image(null),
    say("[Через пару часов Саша и Джей встретились и поехали в университет подавать документы]"),

    action("StartQuest", ["/Quest/Game2"]),

    scene(null),
    action("ChapterDone", ["act1", "act2"]),
]);

$game.dialog.setStage('act2-1', [
    scene(SC_KHNUE1, "(Приёмная комиссия ХНЭУ)"),
    action("show"),

    image(null),
    say("[Заходят в здание Приемной комиссии]"),

    image(C_YOU_2),
    say("Ого, а тут правда прикольно!", CHR_YOU),

    image(C_FRIEND2_1),
    say("Ну и много же людей, мы тут на долго… *приуныл*", CHR_FRIEND2),

    image(null),
    say("[Пару минут спустя выходит молодая женщина]"),

    image(C_WOMAN1_1),
    say("Ребят, кто за кофе сбегает? Зайдете без очереди! *улыбается*", CHR_WOMAN1),

    image(C_FRIEND2_1),
    say("*долго не думая* Я сбегаю!", CHR_FRIEND2),

    image(null),
    say("[Пока все не понимали что происходит, Джей уже вернулся и они с Сашей зашли в кабинет]"),

    scene(SC_KHNUE2),

    image(C_WOMAN1_2),
    say("Спасибо большое, ты меня спас! *радуется* Давайте свои документы.", CHR_WOMAN1),
    say("Молодцы, ничего не забыли, но у меня будет к вам еще задание", CHR_WOMAN1),

    action("StartQuest", ["/Quest/Game1"]),

    say("Теперь нам нужно рассчитать конкурсный бал, я вам расскажу как. На какую специальность факультета Экономической информатики вы хотите поступать?", CHR_WOMAN1),

    image(C_TOGETHER1_1),
    say("Компьютерные науки!", CHR_TOGETHER1),

    // Do something here?

    goto("act2-2"),
]);

$game.dialog.setStage('act2-2', [
    scene(SC_KHNUE2, "(Через некоторое время…)"),
    action("show"),

    image(C_WOMAN1_3),
    say("Ребята, тут мы закончили, я вас поздравляю!", CHR_WOMAN1),
    say("Теперь вам нужно отправиться на кафедру вашей специальности и найти преподавателя Александра Всеволодовича, что бы пройти собеседование.", CHR_WOMAN1),
    say("Скажу по секрету, он очень классный. Удачи вам!", CHR_WOMAN1),

    image(C_FRIEND2_1),
    say("Спасибо.", CHR_FRIEND2),

    image(C_YOU_3),
    say("До свидания!", CHR_YOU),

    scene(SC_KHNUE2, "(По дороге к Александру Всеволодовичу)"),

    image(null),
    say("[Ребята отправились на поиски кафедры. Оказалось, она была на 4 этаже главного корпуса, аудитория 413]"),
    say("[Но пока наши друзья ее нашли, они по ошибке зашли в деканат и познакомились с деканом]"),

    image(C_DEKAN_1),
    say("Здравствуйте, ребята, вы кого-то ищите? Не меня случайно? *смеётся*", CHR_DEKAN),

    image(C_YOU_2),
    say("Если вы Александр Всеволодович, тогда вас.", CHR_YOU),

    image(C_DEKAN_1),
    say("Вы наверное абитуриенты? Нет, я не тот кто вам нужен. Я декан этого факультета…", CHR_DEKAN),

    image(C_YOU_1),
    say("Извините…", CHR_YOU),

    image(C_DEKAN_1),
    say("Ничего. *смеётся* А вам нужно в конец коридора, аудитория 411, там на двери еще написано Microsoft Academy.", CHR_DEKAN),

    image(C_TOGETHER1_1),
    say("Спасибо большое!", CHR_TOGETHER1),

    image(C_DEKAN_1),
    say("Удачи ребята! Надеюсь мы встретимся в новом учебном году.", CHR_DEKAN),

    image(C_FRIEND2_1),
    say("До свидания.", CHR_FRIEND2),

    scene(null),
    action("ChapterDone", ["act2", "act3"]),
]);

$game.dialog.setStage('act3-1', [
    scene(SC_KHNUE3, "(Аудитория 411)"),
    action("show"),

    image(C_YOU_3),
    say("Здравствуйте, а мы должны у вас пройти собеседование?", CHR_YOU),

    image(C_PROFESSOR_1),
    say("Да, смелее ребята, заходите. Ничего страшного не будет, нужно только решить простую логическую задачку.", CHR_PROFESSOR),

    image(C_YOU_1),
    say("Ой… *испугался*", CHR_YOU),

    image(C_FRIEND2_1),
    say("Чего ты, все будет окей. Мы готовы!", CHR_FRIEND2),

    image(C_PROFESSOR_1),
    say("Вот и молодцы, держите этот прикольный аппарат.", CHR_PROFESSOR),

    action("StartQuest", ["/Quest/Game3"]),

    image(C_PROFESSOR_1),
    say("А я смотрю вы хорошо запоминаете, так держать, половина работы выполнена.", CHR_PROFESSOR),
    say("Вам осталось пройти тесты, вы с похожим уже сталкивались на ЗНО, только у нас вопросов меньше.", CHR_PROFESSOR),

    image(null),
    scene(SC_KHNUE3, "(Через некоторое время…)"),

    image(C_PROFESSOR_1),
    say("Справились быстрее многих ребят, надеюсь не только быстро, но и правильно. *смеётся*", CHR_PROFESSOR),

    image(C_YOU_2),
    say("Спасибо, мы тоже надеемся. Осталось рассчитать рейтинговый бал.", CHR_YOU),

    image(C_PROFESSOR_1),
    say("Вот на компьютере есть специальный калькулятор, воспользуйтесь им.", CHR_PROFESSOR),

    image(null),
    say("[Саша и Джей сели считать свой рейтинговый балл]"),

    // Do something here?

    image(C_FRIEND2_1),
    say("Спасибо вам большое, до свидания!", CHR_FRIEND2),

    image(null),
    scene(SC_KHNUE1, "(Выходят из кабинета)"),

    image(C_FRIEND2_1),
    say("Ну что, теперь можно и погулять.", CHR_FRIEND2),

    image(C_YOU_3),
    say("Да, нужно отдохнуть.", CHR_YOU),

    image(null),
    say("[Саша и Джей отправились гулять]"),

    goto('act3-2'),
]);

$game.dialog.setStage('act3-2', [
    scene(SC_LECTURE, "(Занятие по программированию)"),
    action("show"),

    image(C_PROFESSOR_1),
    say("Сейчас, вам нужно будет зайти на сайт, на котором находится список задач – их нужно выполнить до следующего занятия. Там все то, что мы разбирали с вами на лекциях.", CHR_PROFESSOR),

    image(C_FRIEND2_1),
    say("Саш, а ты писал лекцию ? А то мне так не хотелось и я ничего не делал. *улыбается*", CHR_FRIEND2),

    image(C_YOU_1),
    say("Да, щас будем разбираться", CHR_YOU),

    image(null),
    scene(SC_LECTURE, "(Через некоторое время…)"),

    image(C_FRIEND2_1),
    say("Вау, у нас получилось, немного до 100 процентов не хватило.", CHR_FRIEND2),

    image(C_YOU_3),
    say("Да, мне очень понравилось, давай дальше решать.", CHR_YOU),

    image(null),
    say("[Подходит преподаватель]"),

    image(C_PROFESSOR_1),
    say("Молодцы ребята, не хотите поучаствовать в олимпиаде?", CHR_PROFESSOR),

    image(C_YOU_3),
    say("Да, конечно!", CHR_YOU),

    image(C_FRIEND2_1),
    say("Еще бы!", CHR_YOU),

    image(null),
    say("[Радостно ответили ребята, так и началось их знакомство с программированием]"),

    goto('ending'),
]);

$game.dialog.setStage('ending', [
    scene(null, "(Заключение)"),
    action("show"),

    image(null),
    say("А ты готов начать свое знакомство с программированием именно в нашем Харьковском национальном экономическом университете имени Семена Кузнеца? Ждем тебя!"),

    action("StartQuest", ["/Quest/Certificate"]),
    action("ChapterDone", ["act3", null]),
]);


$game.map.addArea('act1', [25.5, 5.4, 28.0, 17.8], "Домашние приключения", [
    { name: "Вступление 1", dialog: "intro-1" },
    { name: "Вступление 2", dialog: "intro-2" },

    { name: "Часть 1", dialog: "act1-1" },
    { name: "Часть 2", dialog: "act1-2" },
]);

$game.map.addArea('act2', [41.6, 33.0, 21.0, 24.0], "Путь сквозь тернии к звездам", [
    { name: "Часть 3", dialog: "act2-1" },
    { name: "Часть 4", dialog: "act2-2" },
]);

$game.map.addArea('act3', [36.0, 64.0, 38.5, 27.2], "Gaudeāmus igĭtur", [
    { name: "Часть 5", dialog: "act3-1" },
    { name: "Часть 6", dialog: "act3-2" },

    { name: "Конец", dialog: "ending" },
]);

$game.map.setBlocked('act1', false);