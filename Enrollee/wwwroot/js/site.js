﻿// Write your JavaScript code.
$(document).ready(function () {

    $('#SubmitComment').click(function () {
        alert('its alive');
        var text = $("#Text").val();
        $.ajax({
            url: '/Comments/CreateFromPartial',
            data: { data: text },
            type: 'POST',
            success: function (obj) {
                alert('Succeded');
            },
            error: function (obj) {
                alert('Something happened');
            }
        });
    });
});