var audioWin = new Audio('https://www.dropbox.com/s/b08q4h3i9m6k1f7/win.mp3?dl=1'); //audioWin.play();
var audioPowerOn = new Audio('https://www.dropbox.com/s/i0g9zunlyzhljwb/poweron.mp3?dl=1');
var audioLose = new Audio('https://www.dropbox.com/s/ud4fafa7uifk7ah/loseSimon.mp3?dl=1');
audioLose.volume = 0.5;
var audio = [];
audio[0] = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
audio[1] = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
audio[2] = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
audio[3] = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");

var simon = {
  sequenceLength: 0, //in retrospect shouldn't have used this...just sequence.length would have been fine
  sequence: [], // 0=t-l, 1=t-r, 2=b-l, 3=b-r ### green,red,yellow,blue
  seqItr: 0,
  strict: false,
  simonOn: false,
  buttons: [".t-l", ".t-r", ".b-l", ".b-r"],
  flashCount: 0,
  flashScoreCount: 0,
  tooLong: null, //save event here that makes player lose if take too long
  playerTurn: false,
  timeoutEvents: [],
  clicked: 0,
  buttonsOff: function() {
    for (var i = 0; i < 4; i++) {
      $(simon.buttons[i]).removeClass('on');
    }
  },
  playerClick: function(i) {
    audio[i].pause();
    audio[i].currentTime = 0;
    audio[i].play();
    $(simon.buttons[i]).addClass('on');
    window.setTimeout(function(i) {
      $(simon.buttons[i]).removeClass('on');
    }, 500, i);
    if (this.sequence[this.seqItr] == i) {
      if (this.seqItr == (this.sequenceLength - 1)) {
        this.playerTurn = false;
        this.play();
      } else {
        this.seqItr++;
        simon.tooLong = window.setTimeout(function() {
          simon.gameOver(0);
        }, 5000);
      }
    } else {
      this.gameOver(0); //lost
    }
  },
  flashCurrent: function() {
    $(simon.buttons[simon.sequence[simon.seqItr]]).addClass('on');
    audio[simon.sequence[simon.seqItr]].play();
    simon.timeoutEvents.push(window.setTimeout(function() {
      $(simon.buttons[simon.sequence[simon.seqItr]]).removeClass('on');
      simon.seqItr++;
      if (simon.seqItr < simon.sequenceLength) {
        simon.timeoutEvents.push(window.setTimeout(function() {
          simon.flashCurrent();
        }, 500));
      } else { //players turn
        simon.playerTurn = true;
        simon.seqItr = 0;
        simon.tooLong = window.setTimeout(function() {
          simon.gameOver(0);
        }, 5000);
      }
    }, 750));
  },
  play: function() {
    if (this.sequenceLength == 20) {
      audioWin.play();
      this.gameOver(1); //won
    } else {
      this.sequenceLength++;
      this.updateCount();
      this.flashScoreCount = 3;
      this.flashScore();
      var nextNum = Math.floor(Math.random() * 4);
      if (nextNum == 4) {
        nextNum = 3;
      }
      this.sequence.push(nextNum);
      this.seqItr = 0;
      simon.timeoutEvents.push(window.setTimeout(function() {
        simon.flashCurrent();
      }, 2500));
    }
  },
  turnOff: function() {
    this.reset();
    this.strict = false;
    $(".m-strict .but .mini-but").removeClass('mini-on');
    $(".m-count .count").removeClass('on');
  },
  updateCount: function() {
    if (this.sequenceLength == 0) {
      $(".count").text('- -');
    } else {
      var countLeft = Math.floor(this.sequenceLength / 10);
      var countRight = (this.sequenceLength % 10);
      $(".count").text(countLeft + ' ' + countRight);
    }
  },
  flashScore: function() {
    $(".count").removeClass('on');
    simon.timeoutEvents.push(window.setTimeout(function() {
      $(".count").addClass('on');
      if (simon.flashScoreCount > 0) {
        simon.flashScoreCount--;
        simon.timeoutEvents.push(window.setTimeout(function() {
          simon.flashScore();
        }, 150));
      }
    }, 150));
  },
  reset: function() {
    this.killTimeouts();
    this.buttonsOff();
    this.sequenceLength = 0;
    this.seqItr = 0;
    this.sequence = [];
    this.flashCount = 0;
    this.flashScoreCount = 0;
    this.playerTurn = false;
    this.updateCount();
  },
  killTimeouts: function() {
    window.clearTimeout(simon.tooLong);
    tooLong = null;
    for (var i = 0; i < simon.timeoutEvents.length; i++) {
      window.clearTimeout(simon.timeoutEvents[i]);
    }
    simon.timeoutEvents = [];
  },
  gameOver: function(i) {
    if (i == 0) { //lost
      simon.seqItr = 0;
      audioLose.play();
      $(".count").text('!!!');
      simon.flashScoreCount = 3;
      simon.flashScore();
      if (simon.strict) { //strict
        simon.timeoutEvents.push(window.setTimeout(function() {
          simon.reset();
          simon.play();
        }, 2000));
      } else { //normal
        simon.timeoutEvents.push(window.setTimeout(function() {
          simon.updateCount();
          simon.flashScoreCount = 3;
          simon.flashScore();
          simon.timeoutEvents.push(window.setTimeout(function() {
            simon.flashCurrent();
          }, 2500));
        }, 2000));
      }
    } else { //won
      $(".count").text("WIN");
      simon.flashScoreCount = 10;
      simon.flashScore();
      simon.flashCount = 10;
      simon.flash(0);

      simon.isWon = true;
    }

  },
  flash: function(i) { //use flashCount=10 for win!
    $(simon.buttons[i]).addClass('on');
    simon.timeoutEvents.push(window.setTimeout(function() {
      $(simon.buttons[i]).removeClass('on');
      if (i < 3) {
        simon.flash(i + 1);
      } else {
          if (simon.flashCount > 0) {
              simon.flashCount--;
              simon.flash(0);
          } else if (simon.isWon) {
              simon.isWon = false;
              setTimeout(function () {
                  window.parent.postMessage('quest-ok', '*');
              }, 2000);
          }
      }
    }, 50));
  }
}

jQuery(document).ready(function($) {

  $(".on-off").click(function(e) {
    var but = $(this).find('.but');
    if ($(but).hasClass('active')) {
      $(but).removeClass('active');
      simon.simonOn = false;
      simon.turnOff();
    } else {
      $(but).addClass('active');
      simon.simonOn = true;
      $(".m-count .count").addClass('on');
      audioPowerOn.play();
      simon.flash(0);
    }
  });

  $(".m-strict .but").click(function(e) {
    $(this).css('height', '24px');
    $(this).css('width', '24px');
    $(this).css('margin-bottom', '11px');
    if (simon.simonOn) {
      var minibut = $(this).find('.mini-but');
      if ($(minibut).hasClass('mini-on')) {
        $(minibut).removeClass('mini-on');
        simon.strict = false;
      } else {
        $(minibut).addClass('mini-on');
        simon.strict = true;
      }
    }
    var but = this;
    simon.timeoutEvents.push(window.setTimeout(function(but) {
      $(".m-strict .but").css('height', '25px');
      $(".m-strict .but").css('width', '25px');
      $(".m-strict .but").css('margin-bottom', '10px');
    }, 100));
  });

  $(".m-start .but").click(function(e) {
    $(this).css('height', '24px');
    $(this).css('width', '24px');
    $(this).css('margin-bottom', '11px');
    simon.timeoutEvents.push(window.setTimeout(function() {
      $(".m-start .but").css('height', '25px');
      $(".m-start .but").css('width', '25px');
      $(".m-start .but").css('margin-bottom', '10px');
    }, 100));

    if (simon.simonOn) {
      window.setTimeout(function() {
        simon.reset();
        simon.play();
      }, 250);
    }
  });

  $(".t-l").click(function(e) {
    if (simon.playerTurn) {
      window.clearTimeout(simon.tooLong);
      simon.playerClick(simon.clicked = 0);
    }
  });

  $(".t-r").click(function(e) {
    if (simon.playerTurn) {
      window.clearTimeout(simon.tooLong);
      simon.playerClick(simon.clicked = 1);
    }
  });

  $(".b-l").click(function(e) {
    if (simon.playerTurn) {
      window.clearTimeout(simon.tooLong);
      simon.playerClick(simon.clicked = 2);
    }
  });

  $(".b-r").click(function(e) {
    if (simon.playerTurn) {
      window.clearTimeout(simon.tooLong);
      simon.playerClick(simon.clicked = 3);
    }
  });
});