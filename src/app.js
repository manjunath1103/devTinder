const express = require("express");

const app = express()

app.get("/user", (req, res) => {
    res.send({firstName: "Manjunath", lastName: "Gowda"})
})

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