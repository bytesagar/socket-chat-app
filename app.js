const express = require("express")
const path = require("path")
const http = require("http")
const socketIo = require("socket.io")
const { getMessage, generateLocation } = require("./utils/messages")


const app = express()
const server = http.createServer(app)
const io = socketIo(server)


const publicDirPath = path.join(__dirname, "public")
app.use(express.static(publicDirPath))


io.on("connection", (socket) => {
    console.log("New web connection")

    socket.emit("message", getMessage("Welcome"))
    socket.broadcast.emit("message", getMessage("A new user has joined"))
    socket.on("sendMessage", (message, callback) => {
        io.emit("message", getMessage(message))
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











const PORT = 3000
server.listen(PORT, () => {
    console.log("Server started")
})