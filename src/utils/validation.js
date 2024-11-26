const validator = require('validator')

const validateSignUpData = (newUser) => {
    const { firstName, emailId, password } = newUser

    if (!firstName) {
        throw new Error("Please Enter 1st Name");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Enter valid email ID")
    }

    // Verify for strong password

    const ALLOWED_DATA = ['firstName', 'lastName', 'emailId', 'password', 'age', 'gender', 'pathToUrl']
    const REQUIRED_DATA = ['firstName', 'lastName', 'emailId', 'password', 'age', 'gender']

    const fields = Object.keys(newUser)

    if (!REQUIRED_DATA.every(field => fields.includes(field))) {
        throw new Error("Missing Required Data");
    }

    if (!fields.every(field => ALLOWED_DATA.includes(field))) {
        throw new Error("Invalid data for signup");
    }
}

const validateLoginData = (emailId, password) => {
    if(!password) {
        throw new Error("Please enter password");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Enter valid email ID")
    }    
}

module.exports = { validateSignUpData, validateLoginData }