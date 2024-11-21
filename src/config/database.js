const mongoose = require('mongoose')

const connectDB = async () => {
    return await mongoose.connect(
        'mongodb+srv://manjunath:UF9IftHqASdatLPy@namastenode.figkr.mongodb.net/devTinder'
    )
}

module.exports = {connectDB}


