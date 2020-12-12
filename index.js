var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4000;

var users = {};

//Static files
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/home.html');
});

app.get('/views/index', function(req, res){
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/views/username', function(req, res){
  res.sendFile(__dirname + '/views/username.html')
})

io.on('connection', function(socket){
  
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  })

  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('connected',(msg)=> {
    users[msg] = msg;
    io.emit('online', users);
    socket.broadcast.emit('connected', msg);
   
  })

  socket.on('disco',(msg)=> {
    io.emit('disco', msg);
  })

  socket.on('online', (users)=> {
    users = users;
    io.emit('online', users);
  })

  socket.on('typing', (data) => {
      socket.broadcast.emit('display', data)
  })
  
})



http.listen(port, function(){
  console.log('listening on *:' + port);
})