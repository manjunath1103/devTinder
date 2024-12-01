const express = require('express')
const bcrypt = require('bcrypt')

const { userAuth } = require('../middleware/auth.js')
const { validateEditProfileData } = require('../utils/validation.js')

const profileRouter = express.Router();

profileRouter.get('/view', userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

profileRouter.patch('/edit', userAuth, async (req, res) => {
    try {
        validateEditProfileData(req.body)
        
        const loggedUser = req.user
        Object.keys(req.body).forEach(key => loggedUser[key] = req.body[key])
        await loggedUser.save()

        res.json({message: "User profile updates", user : loggedUser})
    } catch (err) {
        res.status(400).send(err.message)
    }
})

profileRouter.patch('/password', userAuth, async (req, res) => {
    try {
        
        const loggedUser = req.user
        const {currentPassword, newPassword} = req.body 
        const isCurrentPasswordValid = await loggedUser.validatePassword(currentPassword)

        if(!isCurrentPasswordValid) throw new Error("Please Enter correct password");
        
        // Check if the new password is strong through validator

        const passwordHash = await bcrypt.hash(newPassword, 10)
        loggedUser.password = passwordHash
        await loggedUser.save()

        res.json({message: "Password Updated"})
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = { profileRouter }