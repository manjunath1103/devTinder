const express = require("express");
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const { connectDB } = require('./config/database')
const { validateSignUpData, validateLoginData } = require('./utils/validation.js')
const {userAuth} = require('./middleware/auth.js')

const User = require('./models/user.js');

const app = express()
app.use(express.json())
app.use(cookieParser())



app.post('/signup', async (req, res) => {
    try {
        const newUser = req.body
        validateSignUpData(newUser)

        const { password } = newUser

        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({ ...newUser, password: passwordHash });
        await user.save()
        res.send(user)

    } catch (err) {
        res.status(400).send(err.message)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body
        validateLoginData(emailId, password)

        const user = await User.findOne({ emailId })
        if(!user) throw new Error("Invalid Login Details");

        const isPasswordValid = user.validatePassword(password)

        if(isPasswordValid) {
            // Create JWT Token
            const token = user.getJWT()

            // Add JWT Token to res.cookie
            res.cookie("token", token, { expires: new Date(Date.now() + 60 * 60 * 1000), httpOnly: true })

            res.send("Login Successful")
        }else{
            throw new Error("Invalid Login Details");
        }
    } catch (err) {
        res.status(400).send(err.message)
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        const user = req.user
        const {firstName} = user
        res.send(`${firstName} sent a request`) 
    } catch (err) {
        res.status(400).send(err.message)
    }
})

app.get("/test", (req, res) => {
    res.send("Test from server")
})

connectDB()
    .then(() => {
        console.log("Database connection established........")
        app.listen(7777, () => console.log("Server listening on PORT 7777"))
    })
    .catch(() => {
        console.log("Database cannot be connected!")
    })