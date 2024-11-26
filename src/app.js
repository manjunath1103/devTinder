const express = require("express");
const { connectDB } = require('./config/database')
const bcrypt = require('bcrypt')
const app = express()
const { validateSignUpData, validateLoginData } = require('./utils/validation.js')

app.use(express.json())

const User = require('./models/user.js');

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
        
        const hash = user.password
        const isPasswordValid = await bcrypt.compare(password, hash)
        if(isPasswordValid) {
            res.send(user)
        }else{
            throw new Error("Invalid Login Details");
        }
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// GET - User by emailId
app.get('/user', async (req, res) => {
    try {
        const { emailId } = req.body
        const users = await User.findOne({ emailId })
        if (users.length === 0) {
            res.status(404).send('User not found')
        } else {
            res.send(users)
        }
    } catch (err) {
        res.status(400).send(err)
    }
})

// GET - All users info for feed
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (err) {
        res.status.send("Something went wrong")
    }
})

// DELETE - By emailId
app.delete('/user', async (req, res) => {
    try {
        const { emailId } = req.body
        // const userDeleted = await User.findOneAndDelete({emailId})
        // return res.send(userDeleted)
        const user = await User.findOne({ emailId })
        if (user) {
            const id = user._id
            const deletedUser = await User.findByIdAndDelete(id)
            res.send(deletedUser)
        } else {
            res.status(404).send("User not found")
        }
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

app.patch('/user/:emailId', async (req, res) => {
    try {
        const data = req.body
        const { emailId } = req.params
        const ALLOWED_UPDATES = ['firstName', 'lastName', 'password', 'age', 'gender', 'pathToUrl', 'about', 'skills']

        const canUpdate = Object.keys(data).every((field) => ALLOWED_UPDATES.includes(field))
        if (!canUpdate) throw new Error("Invalid data to update.")

        const updatedUser =
            await User.findOneAndUpdate(
                { emailId },
                data,
                { returnDocument: "after", runValidators: true }
            )

        res.send(updatedUser)

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

