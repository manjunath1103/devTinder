const express = require("express");

const app = express()

app.use("/hello", (req, res) => {
    res.send("Hello World")
})

app.use("/test", (req, res) => {
    res.send("Test from server")
})

app.use("/", (req, res) => {
    res.send("Namaste")
})

app.listen(7777, () => {
    console.log("Server Listening on PORT 3000")
})