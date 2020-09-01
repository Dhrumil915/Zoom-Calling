const express = require('express');
const app = express();
const server = require('http').Server(app);
const  { v4:uuidv4 } = require('uuid');
const { deepStrictEqual } = require('assert');
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use('/peerjs', peerServer);
app.set('view engine', 'ejs');
app.use(express.static('public'));



app.get('/', (req, res) => {
res.redirect(`/${uuidv4()}`)
});

 app.get('/:room',(req, res) => {
    res.render('room', {roomID: req.params.room});
 });

 io.on('connection', socket =>{
   socket.on('join-room', (roomID, userId) => {
     socket.join(roomID);
     socket.to(roomID).broadcast.emit('user-connected', userId);
      console.log("joining room");
      socket.on('message', message =>{
        io.to(roomID).emit('createMessage', message)
      })
   })
 });





server.listen(process.env.PORT||3030);