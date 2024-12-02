const express = require("express");
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())

const { connectDB } = require('./config/database')
const {authRouter} = require('./routes/auth.js')
const {profileRouter} = require('./routes/profile.js')
const {requestRouter} = require('./routes/requests.js');
const { userRouter } = require("./routes/user.js");

app.use('/', authRouter)
app.use('/profile', profileRouter)
app.use('/request', requestRouter)
app.use('/user', userRouter)

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