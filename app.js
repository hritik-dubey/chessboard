const express = require('express');
const app = express();
const http = require('http');
const socket = require('socket.io');
const server =  http.createServer(app)
const path = require('path');
const ejs = require('ejs');
const {Chess} = require('chess.js');

const chess =  new  Chess()



const io = socket(server)
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.render('index', {title: 'chess master',})
})

server.listen(3000, function(){
  console.log('listening on *:3000');
})