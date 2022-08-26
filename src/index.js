const express = require('express');
const { Server } = require("socket.io");
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const mongoose = require('mongoose');

//conexin db
mongoose.connect('mongodb://192.168.10.34:27017/proyecto3')
.then(db=>console.log(' conexion correcta'))
.catch(err=> console.log(err))

//setting
app.set('port', process.env.PORT || 3000);

require('./sockets')(io);
//archivo estaticos
app.use(express.static(path.join(__dirname, 'public')));

  
//inicio rl srver
server.listen(app.get('port'), () => {
    console.log('server escuhabdo en el puerto: ', app.get('port'));
});
