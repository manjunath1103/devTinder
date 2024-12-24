const express = require("express")

const { userAuth } = require("../middleware/auth")
const { ConnectionRequest } = require("../models/connectionRequest")
const { User } = require("../models/user")

const userRouter = express.Router()

userRouter.get("/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"])

        res.json({
            message: "Pending requests",
            data: connectionRequests
        })

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

userRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
            status: "accepted"
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)

        const connectedUsers = connections.map(({ fromUserId, toUserId }) => {
            return fromUserId._id.equals(loggedInUser._id) ? toUserId : fromUserId
        })

        res.json({
            message: "All connections",
            connectedUsers
        })

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit

        const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()

        connectionRequests.forEach(connection => {
            hideUsersFromFeed.add(connection.fromUserId.toString());
            hideUsersFromFeed.add(connection.toUserId.toString());
        })

        const users = await User.find({
            $and: [
                {
                    _id: {
                        $nin: Array.from(hideUsersFromFeed)
                    }
                },
                {
                    _id: {
                        $ne: loggedInUser._id
                    }
                }
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

        res.json({ message: users });

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = { userRouter }