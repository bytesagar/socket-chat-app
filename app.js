const express = require("express")
const path = require("path")
const http = require("http")
const socketIo = require("socket.io")
const { getMessage, generateLocation } = require("./utils/messages")
const connetToDB = require("./Database/dbConfig")


const app = express()
const server = http.createServer(app)
const io = socketIo(server)
connetToDB()


app.use(express.static(__dirname + "/public"))

app.set("view engine", 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res, next) => {
    res.render("index")
    next()
})
app.get("/chat", (req, res) => {
    res.render("chat")
})
io.on("connection", (socket) => {
    console.log("New web connection")

    socket.on("join", ({ username, room }) => {
        socket.join(room)

        socket.emit("message", getMessage(`Welcome To Chat Room`))
        socket.broadcast.to(room).emit("message", getMessage(`${username} has joined.`))


    })
    socket.on("sendMessage", (message, callback) => {

        io.to('sagar').emit("message", getMessage(message))
        callback("Delivered")
    })
    socket.on("sendLocation", (location, callback) => {
        socket.broadcast.emit("locationMessage", generateLocation(`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
        // io.emit("message", location)
    })
    socket.on("disconnect", () => {
        io.emit("message", getMessage("A user has left"))
    })

})











const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log("Server started")
})