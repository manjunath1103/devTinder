const express = require("express");

const app = express()

app.use('/user', (req, res, next) => {
    const token = "xyz"
    const isAdminAuthorized = token === 'xyz'
    if(!isAdminAuthorized) {
        res.status(401).send("Unauthorized Request")
    }else{
        next()
    }
})

app.get("/user",
    (req, res, next) => {
        console.log("Route handler 1 GET /user route")
        next()
    },
    (req, res, next) => {
        console.log("Route handler 4 GET /user route")
        res.send("Response")
    }
)

app.post("/user", (req, res) => {
    // Save user to database
    res.send("User successfully added to database.")
})

app.delete("/user", (req, res) => {
    // Delete user from the database
    res.send("User deleted from the database.")
})

app.use("/test", (req, res) => {
    res.send("Test from server")
})

app.listen(7777, () => {
    console.log("Server Listening on PORT 3000")
})