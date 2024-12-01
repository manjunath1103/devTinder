const jwt = require('jsonwebtoken')
const {User} = require('../models/user.js')

const userAuth = async (req, res, next) => {

    try {
        const {token} = req.cookies
        if(!token) throw new Error("Please Login Again")

        const decoded = jwt.verify(token, "SECRET_KEY")
    
        const {_id} = decoded
        const user = await User.findById(_id)
        
        if(!user) throw new Error("User Not Found");

        req.user = user
        next()
    } catch (err) {
        res.status(400).send(err.message)
    }
}

module.exports = { userAuth }