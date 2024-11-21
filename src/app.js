const express = require("express");
const { connectDB } = require('./config/database')
const app = express()

const User = require('./models/user.js')

app.post('/signup', async (req, res) => {
    try {
        const newUser = {
            firstName : "Manjunath",
            lastName : "Gowda",
            emailId : "manjunath@gmail.com",
            password : "pass123",
            age : 21,
            gender : "Male"
        }
        const user = new User(newUser);
        await user.save()
        res.send(user)
    } catch (err) {
        res.status(400).send("Error saving user")
    }
})

connectDB()
    .then(() => {
        console.log("Database connection established........")
        app.listen(7777, () => console.log("Server listening on PORT 7777"))
    })
    .catch(() => {
        console.log("Database cannot be connected!")
    })


app.get("/test", (req, res) => {
    res.send("Test from server")
})
