const express = require('express')
const bcrypt = require('bcrypt')

const { User } = require('../models/user.js')
const { validateSignUpData, validateLoginData } = require('../utils/validation.js')

const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body
        validateLoginData(emailId, password)

        const user = await User.findOne({ emailId })
        if (!user) throw new Error("Invalid Login Details");

        const isPasswordValid = await user.validatePassword(password)

        if (isPasswordValid) {
            // Create JWT Token
            const token = user.getJWT()

            // Add JWT Token to res.cookie
            res.cookie("token", token, { expires: new Date(Date.now() + 60 * 60 * 1000), httpOnly: true })

            res.send("Login Successful")
        } else {
            throw new Error("Invalid Login Details");
        }
    } catch (err) {
        res.status(400).send(err.message)
    }
})

authRouter.post('/logout', async (req, res) => {
    res.cookie("token", null, {expires: new Date(Date.now())})
    res.send("Logout Successful")
})

module.exports = { authRouter }