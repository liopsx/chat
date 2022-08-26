const Chat = require('./models/Chat')
module.exports = function (io) {
  let asesino = ["MUERTE", "MATAR", "ASESINAR", "ASESINEN", "MUERTO"]
  var conteo = 0
  let users = {};
  io.on('connection', async socket => {

    console.log('new user connected');
    conteo++;
    io.emit('contador', conteo);
    let messages = await Chat.find({}).limit(8).sort('-created')
    socket.emit('load old', messages);

    socket.on('new user', (data, cb) => {
      if (data in users) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNicknames();
      }
    });

    socket.on('send message', async (data, cb) => {
      var msg = data.trim();

      if (msg.substr(0, 3) === '/p ') {
        msg = msg.substr(3);
        const index = msg.indexOf(' ');
        if (index !== -1) {
          var name = msg.substring(0, index);
          var msg = msg.substring(index + 1);
          if (name in users) {
            users[name].emit('whisper', {
              msg,
              nick: socket.nickname
            });
          } else {
            cb('error! no esta conectado el usuario')
          }
        } else {
          cb('error! por favr ingresa el mensaje a enviar');
        }
      } else {
        var newmsg = new Chat({
          msg,
          nick: socket.nickname
        });
        await newmsg.save();

        io.sockets.emit('new message', {
          msg: data,
          nick: socket.nickname
        });

      }
      texto = msg.toUpperCase()
      //met.insertdata(msg)
      for (let x of asesino) {
        if (texto.search(x) > -1) {
          console.log("El cliente " + socket.nickname + " dijo esta palabra prohibida: " + x + " || Mensaje donde se encuentra la palabra: " + msg)
          io.emit("espionaje", "El cliente " + socket.nickname + " dijo esta palabra prohibida: " + x + " || Mensaje donde se encuentra la palabra: " + msg)
        }
      }
    });
    socket.on('disconnect', data => {
      conteo--
      io.emit('contador', conteo);
      if (!socket.nickname) return;
      delete users[socket.nickname];
      updateNicknames();

    });
    function updateNicknames() {
      io.sockets.emit('usernames', Object.keys(users));
    }
  });

}
