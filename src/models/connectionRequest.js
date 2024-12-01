const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
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

connectionRequestSchema.pre("save", function() {
    if(this.toUserId.equals(this.fromUserId)){
        throw new Error("Cannot Send Request To Self");
    }
})

const ConnectionRequest = new mongoose.model(
    "ConnectionRequest", connectionRequestSchema
)

module.exports = { ConnectionRequest }