const express = require("express")
const path = require("path")
const http = require("http")
const session = require("express-session")
const bcrypt = require("bcrypt")
const socketIo = require("socket.io")
const flash = require("connect-flash")
const getMessage = require("./utils/messages")
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users")
const { Socket } = require("net")




const app = express()
const server = http.createServer(app)
const io = socketIo(server)



app.use(express.static(__dirname + "/public"))

app.set("view engine", 'ejs')
app.use(express.urlencoded({ extended: false }))




app.get("/", (req, res) => {
    res.render("index")
})

app.get("/chat", (req, res) => {
    res.render("chat")
})

io.on("connection", (socket) => {
    console.log("User connected")

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }
        console.log(socket.connected)
        socket.join(user.room)

        socket.emit('message', getMessage('Admin', "Welcome"))

        socket.broadcast.to(user.room).emit('message', getMessage('Admin', `${user.username} has joined the room`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })
    //receive message
    socket.on('send-message', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', getMessage(user.username, message))
        callback('Delivered')
    })


    //listen on typing
    // socket.on('typing', data => {
    //     socket.broadcast.emit('typing', data)
    // })

    //on disconnect
    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        console.log(user)
        if (user) {
            socket.to(user.room).emit('notification', getMessage('Admin', `${user.username} left the room!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            io.to(user.room).emit('message', getMessage('Admin', `${user.username} has left!`))
        }
    })
})









const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log("Server started")
})