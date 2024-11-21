const express = require("express");

const app = express()

const { userAuth, adminAuth } = require("./middleware/auth")

// We don't need middleware always. Like we don't need auth during login or signup

// Admin

app.use('/admin', adminAuth)

app.get('/admin/getAllData', (req, res) => {
    res.send("All data sent")
})

app.delete('/admin/deleteUser', (req, res) => {
    res.send("User deleted")
})

// User

app.get("/user/data",
    userAuth,
    (req, res, next) => {
        console.log("Route handler 1 GET /user route")
        next()
    },
    (req, res, next) => {
        console.log("Route handler 4 GET /user route")
        res.send("Response")
    }
)

app.post("/user/login", (req, res) => {
    // Save user to database
    res.send("User successfully added to database.")
})

app.delete("/user", userAuth, (req, res) => {
    // Delete user from the database
    res.send("User deleted from the database.")
})

app.use("/test", (req, res) => {
    res.send("Test from server")
})

app.listen(7777, () => {
    console.log("Server Listening on PORT 3000")
})