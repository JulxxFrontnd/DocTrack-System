const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    position: String,
    office: String,
    role: {
        type: String,
        default: "user"
    }
})

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel  