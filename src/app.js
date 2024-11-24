const express = require("express");
const { connectDB } = require('./config/database')
const app = express()

app.use(express.json())

const User = require('./models/user.js');

app.post('/signup', async (req, res) => {
    try {
        const ALLOWED_DATA = ['firstName', 'lastName', 'emailId', 'password', 'age', 'gender', 'pathToUrl']
        const REQUIRED_DATA = ['firstName', 'lastName', 'emailId', 'password', 'age', 'gender']

        const newUser = req.body
        const fields = Object.keys(newUser)

        if(!REQUIRED_DATA.every(field => fields.includes(field))) {
            throw new Error("Missing Required Data");
        }

        if(!fields.every(field => ALLOWED_DATA.includes(field))) {
            throw new Error("Invalid data for signup");
        }
        
        const user = new User(newUser);
        await user.save()
        res.send(user)

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

