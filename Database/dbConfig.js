const mongoose = require("mongoose")
const connetToDb = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/ChatApp", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => {
            console.log("Database Connected")
        })
    } catch (err) {
        console.log(err)
    }
}
module.exports = connetToDb