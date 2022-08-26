$(function () {
    const socket = io();
    //obteniendo parte del Dom
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // obtaining DOM elements from the NicknameForm Interface
    const $nickForm = $("#nickForm");
    const $nickError = $("#nickError");
    const $nickname = $("#nickname");

    // obtaining the usernames container DOM
    const $users = $("#usernames");

    $nickForm.submit((e) => {
        e.preventDefault();
        socket.emit("new user", $nickname.val(), (data) => {
            if (data) {
                $("#nickWrap").hide();
                // $('#contentWrap').show();
                document.querySelector("#contentWrap").style.display = "flex";
                $("#message").focus();
            } else {
                $nickError.html(`
            <div class="alert alert-danger">
              That username already Exists.
            </div>
          `);
            }
        });
        $nickname.val("");
    });

    //eventos
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        });
        $messageBox.val('');
    });
    socket.on('new message', function (data) {
        $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>');
    });
    socket.on('usernames', data => {

        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += ` <p><i class="fas fa-user"></i> ${data[i]}</p>`
        }
        $users.html(html);
    })
    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`);
    })
    socket.on('load old', msgs => {
        for (let i = msgs.length- 1; i >= 0; i--) {
            displaysmsg(msgs[i]);
        }
    })
    function displaysmsg(data) {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`);

    }
})