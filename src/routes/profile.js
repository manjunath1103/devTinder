const express = require('express')

const { userAuth } = require('../middleware/auth.js')

const profileRouter = express.Router();

profileRouter.get('/', userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = { profileRouter }