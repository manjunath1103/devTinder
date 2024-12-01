const express = require('express')

const { userAuth } = require('../middleware/auth.js')
const { ConnectionRequest } = require('../models/connectionRequest.js')
const { User } = require('../models/user.js')

const requestRouter = express.Router()

requestRouter.post('/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const { toUserId, status } = req.params

        if(fromUserId == toUserId) {
            throw new Error("Cannot send request to myself");
        }

        const ALLOWED_STATUS = ["interested", "ignored"]
        if(!ALLOWED_STATUS.includes(status)) {
            throw new Error("Invalid Status Type");
        }

        const toUser = await User.findById(toUserId)
        if(!toUser) {
            throw new Error("User Not Found");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnectionRequest) {
            throw new Error("Connection Request Already Exists")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const connectionRequestData = await connectionRequest.save()

        const statusMessages = {
            interested: "is interested in",
            ignored: "ignored"
        };
        
        const message = `${req.user.firstName} ${statusMessages[status]} ${toUser.firstName}`;
        
        res.json({
            message,
            connectionRequestData
        });

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = { requestRouter }