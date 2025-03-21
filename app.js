const express = require('express');
const app = express();
const http = require('http');
const socket = require('socket.io');
const server = http.createServer(app)
const path = require('path');
const ejs = require('ejs');
const {Chess} = require('chess.js');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

const chess = new Chess()
// let currentPlayesrs = "W"
let players = {}

const io = socket(server)
io.on('connection', (client) => {
    console.log("client connected")
    if (!players.white) {
        players.white = client.id
        client.emit('playerRole', 'w')
    }
    else if (!players.black) {
        players.black = client.id
        client.emit('playerRole', 'b')
    } else {
        client.emit('spectatorRole')
    }
    // client.emit('boardState', chess.fen())
    //need to update once player is disconnected
    client.on('disconnect', () => {
        if (players.white === client.id) {
            delete players.white
            // client.emit('endGame',)
        }
        if (players.black === client.id) {
            delete players.black
        }
    })

    client.on("move", (move) => {
        try {
            if (chess.turn() === 'w' && client.id !== players.white) return
            if (chess.turn() === 'b' && client.id !== players.black) return
            let calculatedMove = chess.move(move)
            if (calculatedMove) {
                io.emit('move', calculatedMove)
                io.emit('boardState', chess.fen())
            } else {
                client.emit('invalidMove', move)
            }
        } catch (e) {
            client.emit('invalidMove', move)
        }
    })
})
app.get('/', function (req, res) {
    res.render('index', {title: 'chess master',})
})

server.listen(3000, function () {
    console.log('listening on *:3000');
})