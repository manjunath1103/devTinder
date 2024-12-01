const express = require('express')

const { userAuth } = require('../middleware/auth.js')

const requestRouter = express.Router()

requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        const user = req.user
        const { firstName } = user
        res.send(`${firstName} sent a request`)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = { requestRouter }