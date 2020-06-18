
const socket = io()

//elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("#message-form input")
const $messageFormButton = document.querySelector("#message-form button")
const $messages = document.querySelector("#messages")
const $room = document.querySelector(".roomname")
const $users = document.querySelector(".users")


//options

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log(username)

socket.on("message", (message) => {
    console.log(message)

    const html = {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('LT')
    }

    const markup = `
    <p class="username" style="margin-bottom: 0px; text-transform: capitalize;">${html.username} - <span>${html.createdAt}</span></p>
    <p class="message">${html.message}</p>
    `
    $messages.insertAdjacentHTML('beforeend', markup)
})

socket.on('roomData', ({ room, users }) => {

    $room.innerHTML = ` <h3>${room}</h3>`
    let html = ''
    users.forEach(user => {
        html += `
                <li class="user" style="list-style:none; color: green">${user.username} - online</li>
        `
    })
    $users.innerHTML = html

})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = $messageFormInput.value
    socket.emit('send-message', message, (err) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (err) {
            console.log(err)
        }
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
    }
})

socket.on('notification', (message) => {
    Push.create('Chat Room', {
        body: message.text,
        // icon: '/icon.png',
        timeout: 4000,
        onClick: function () {
            window.focus()
            this.close()
        },
    })
})