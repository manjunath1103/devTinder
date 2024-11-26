const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    lastName: {
        type: String,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid EmailID");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 15,
        max: 75
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return ['male', 'female', 'other'].includes(value)
            },
            message: "Invalid Gender"
        }
    },
    pathToUrl: {
        type: String,
        default: "https://picsum.photos/536/354",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid Photo URL");
            }
        }
    },
    about: {
        type: String,
        default: "This is about section of the developer"
    },
    skills: {
        type: [String],
        validate: {
            validator: function (value) {
                return value.length <= 20
            },
            message: "Too many skills"
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema)