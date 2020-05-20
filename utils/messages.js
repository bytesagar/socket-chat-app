const getMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}
const generateLocation = (url) => {
    return {
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = { getMessage, generateLocation }