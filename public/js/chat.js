const socket = io()

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button")
const $sendLocatonButton = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const linkTemplate = document.querySelector("#location-message-template").innerHTML

socket.on("message", (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('LT')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


socket.on("locationMessage", (message) => {
    const html = Mustache.render(linkTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format("LT")
    })
    $messages.insertAdjacentHTML("beforeend", html)
})




$messageForm.addEventListener("submit", (e) => {
    e.preventDefault()

    //disable the button
    $messageFormButton.setAttribute("disabled", "disabled")

    const message = e.target.elements.message.value

    socket.emit("sendMessage", message, (message) => {

        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value = "";
        $messageFormInput.focus()
        console.log("The message was delivered!", message)
    })
    message.textContent = ""
})
$sendLocatonButton.addEventListener("click", (e) => {
    e.preventDefault()


    if (!navigator.geolocation) {
        return alert("geoloacation is not supported by your browser")
    }
    //disable button
    $sendLocatonButton.setAttribute("disabled", "disabled")

    navigator.geolocation.getCurrentPosition((position) => {
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit("sendLocation", location, () => {
            $sendLocatonButton.removeAttribute("disabled")
            console.log("Location was shared!")
        })
    })
})