// Write your JavaScript code.
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
        alert('its alive');
        var text = $("#Text").val();
        $.ajax({
            url: '/Comments/CreateFromPartial',
            data: { data: text },
            type: 'POST',
            success: function (obj) {
                $("#Text").val("");
                getComments();
            },
            error: function (obj) {
                alert('Something happened');
            }
        });
    });
});

$('#CommentListSegment').on('click', '.SwitchPageBtn', getComments);

$(document).ready(function () {
    $("#game-fullscreen").click(function () {
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

            var obj = $("#game-body")[0];

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
