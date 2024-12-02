const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User"
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: '{VALUE} is not supported'
        }
    }
}, {
    timestamps: true
})

connectionRequestSchema.index(
    { fromUserId: 1, toUserId: 1 },
    { unique: true } 
)

connectionRequestSchema.pre("save", function() {
    if(this.toUserId.equals(this.fromUserId)){
        throw new Error("Cannot Send Request To Self");
    }
})

const ConnectionRequest = new mongoose.model(
    "ConnectionRequest", connectionRequestSchema
)

module.exports = { ConnectionRequest }