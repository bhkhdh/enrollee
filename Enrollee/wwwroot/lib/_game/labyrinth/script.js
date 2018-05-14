"use strict";
var way3 = document.getElementById("svg_4");
var way2 = document.getElementById("svg_5");
var way1 = document.getElementById("svg_9");

var butt1 = document.getElementById("butt1");
var butt2 = document.getElementById("butt2");
var butt3 = document.getElementById("butt3");

var star1 = document.getElementById("star1");
var star2 = document.getElementById("star2");
var star3 = document.getElementById("star3");

var boy = document.getElementById("boy-image");

var dog = document.getElementsByClassName("doggy-container")[0];

var score = 3;
var winner = false;

function mistake() {
	if (winner)
		return;
	score = Math.max(--score, 1);
	star2.hidden = score < 2;
	star3.hidden = score < 3;
}

function win() {
	winner = true;
	if (boy) {
        boy.setAttribute('xlink:href', "/lib/_game/labyrinth/img/boy-happy.png");
	}
	if (dog) {
		dog.style.visibility = "visible";
    }
    setTimeout(function () {
        window.parent.postMessage('quest-ok', '*');
    }, 2000);
}

var clicked = [0, 0, 0];

butt1.onclick = function () {
	if (!clicked[0]++) {
		win();
		way1.classList.add("clicked");
		butt1.classList.add("clicked");
	}
};
butt2.onclick = function () {
	if (!clicked[1]++) {
		mistake();
		way2.classList.add("clicked");
		butt2.classList.add("clicked");
	}
};
butt3.onclick = function () {
	if (!clicked[2]++) {
		mistake();
		way3.classList.add("clicked");
		butt3.classList.add("clicked");
	}
};


(function () {
	function dogLookLeft() {
		document.querySelector(".doggy-standing").style.display = "none";
		document.querySelector(".doggy-jumping").style.display = "none";
		document.querySelector(".doggy-sitting").style.display = "block";
		document.querySelector(".look-left").style.display = "block";
		document.querySelector(".look-right").style.display = "none";
	}

	function dogLookRight() {
		document.querySelector(".doggy-jumping").style.display = "none";
		document.querySelector(".look-left").style.display = "none";
		document.querySelector(".look-right").style.display = "block";
		document.querySelector(".doggy-standing").style.display = "none";
	}

	function dogStand() {
		document.querySelector(".look-right").style.display = "none";
		document.querySelector(".doggy-sitting").style.display = "none";
		document.querySelector(".doggy-standing").style.display = "block";
		document.querySelector(".doggy-jumping").style.display = "none";
	}

	function dogJump() {
		document.querySelector(".doggy-sitting").style.display = "none";
		document.querySelector(".look-left").style.display = "none";
		document.querySelector(".look-right").style.display = "none";
		document.querySelector(".doggy-standing").style.display = "none";
		document.querySelector(".doggy-jumping").style.display = "block";
	}
	var pause = function () {
		var promise = new Promise(function (nextSlide, reject) {
			setTimeout(function () {
				dogLookLeft();
				nextSlide();
			}, 2000);
		});
		return promise;
	};
	var lookLeft = function () {
		var promise = new Promise(function (nextSlide, reject) {
			setTimeout(function () {
				dogLookLeft();
				nextSlide();
			}, 300);
		});
		return promise;
	};
	var lookRight = function () {
		var promise = new Promise(function (nextSlide, reject) {
			setTimeout(function () {
				dogLookRight();
				nextSlide();
			}, 300);
		});
		return promise;
	};
	var standingDog = function () {
		var promise = new Promise(function (nextSlide, reject) {
			setTimeout(function () {
				dogStand();
				nextSlide();
			}, 300);
		});
		return promise;
	};
	var jumpingDog = function () {
		var promise = new Promise(function (nextSlide, reject) {
			setTimeout(function () {
				dogJump();
				nextSlide();
			}, 300);
		});
		return promise;
	};


	function playAnimation() {
		lookLeft()
			.then(pause)
			.then(lookRight)
			.then(lookLeft)
			.then(lookRight)
			.then(lookLeft)
			.then(standingDog)
			.then(jumpingDog)
			.then(standingDog)
			.then(jumpingDog)
			.then(standingDog)
			.then(lookLeft)
	}

	playAnimation();

	setInterval(playAnimation, 3300);
})();