// not used yet
var ISCONNECTED = {
    power : false,
    video : false,
    keyboard: false,
    mouse: false,
    audio: false,
    ethernet: false
};
//
var COUNTER = 6;
var ERRORCOUNTER = 0;

function checkGameStatus(){
    if (COUNTER === 0) {
        $("#successMessage .errors").text(ERRORCOUNTER);
        $("#successMessage").show();

        setTimeout(function () {
            window.parent.postMessage('quest-ok', '*');
        }, 2000);
    }
}

function reset(){
  ISCONNECTED = {
    power : false,
    video : false,
    keyboard: false,
    mouse: false,
    audio: false,
    ethernet: false};
  COUNTER = 6;

  $( "#power" ).show();
  $( ".power" ).removeClass("match");
  $('.power').find('> img').remove();
  $( "#video" ).show();
  $( ".video" ).removeClass("match");
  $('.video').find('> img').remove();
  $( "#keyboard" ).show();
  $( ".keyboard" ).removeClass("match");
  $('.keyboard').find('> img').remove();
  $( "#mouse" ).show();
  $( ".usb1, .usb2, .usb3" ).removeClass("match");
  $('.usb1').find('> img').remove();
  $('.usb2').find('> img').remove();
  $('.usb3').find('> img').remove();
  $( "#audio" ).show();
  $( ".audio" ).removeClass("match");
  $('.audio').find('> img').remove();
  $( "#ethernet" ).show();
  $( ".ethernet" ).removeClass("match");
  $('.ethernet').find('> img').remove();
  
  
   $( "#successMessage" ).hide();
}

function handleConnection( event, ui ) {
  var slotType = $(this).data( 'type' );
  var connectorType = ui.draggable.data( 'type' );

  // If the card was dropped to the correct slot,
  // change the card colour, position it directly
  // on top of the slot, and prevent it being dragged
  // again

  if ( slotType == connectorType ) {
    ui.draggable.hide();
    $( this ).addClass( "match" );
    $( this ).prepend('<img class="check" src="https://i.imgur.com/vmZaq6y.png" >')
    COUNTER--;
    checkGameStatus();
  }
  else{
    ERRORCOUNTER++;
    
  }
}

$(document).ready(function(){  
    $( "#power" ).data('type','power');
    $( ".power" ).data('type','power');
    $( "#video" ).data('type','hdmi');
    $( ".video" ).data('type','hdmi');
    $( "#keyboard" ).data('type','PS2');
    $( ".keyboard" ).data('type','PS2');
    $( "#mouse" ).data('type','USB');
    $( ".usb1, .usb2, .usb3" ).data('type','USB');
    $( "#audio" ).data('type','audio');
    $( ".audio" ).data('type','audio');
    $( "#ethernet" ).data('type','ethernet');
    $( ".ethernet" ).data('type','ethernet');



     $( "#power" ).draggable({      
        cursor: 'move',
        revert: true
      });
      $( ".power" ).droppable({
        drop: handleConnection      
      });

      $( "#video" ).draggable({      
        cursor: 'move',
        revert: true
      });
      $( ".video" ).droppable({
        drop: handleConnection
      });

       $( "#keyboard" ).draggable({      
        cursor: 'move',
        revert: true
      });
      $( ".keyboard" ).droppable({
        drop: handleConnection
      });

       $( "#mouse" ).draggable({      
        cursor: 'move',
        revert: true
      });
      $( ".usb1, .usb2, .usb3" ).droppable({
        drop: handleConnection
      });

        $( "#audio" ).draggable({      
        cursor: 'move',
        revert: true
      });
      $( ".audio" ).droppable({
        drop: handleConnection
      });

        $( "#ethernet" ).draggable({      
        cursor: 'move',
        revert: true
      });
      $( ".ethernet" ).droppable({
        drop: handleConnection
      });
  });
  
  
