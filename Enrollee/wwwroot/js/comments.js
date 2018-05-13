
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
        var text = $("#CommentText").val();
        $.ajax({
            url: '/Comments/CreateFromPartial',
            data: { data: text },
            type: 'POST',
            success: function (obj) {
                $("#CommentText").val("");
                getComments();
            },
            error: function (obj) {
                alert('Something happened');
            }
        });
    });
});

$('#CommentListSegment').on('click', '.SwitchPageBtn', getComments);