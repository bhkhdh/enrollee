$(document).ready(function () {

    $('#SaveBtn').click(function () {
        alert('its alive');
        var text = $("#Text").val();
        $.ajax({
            url: '@Url.Action("CreateFromPartial", "Comments")',
            data: { data: text },
            type: 'POST',
            success: function (obj) {
                alert('Suceeded');
            },
            error: function (obj) {
                alert('Something happened');
            }
        });
    });
});