const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const cors = require("cors")

dotenv.config()

//set up server

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log("App is running on port " + PORT))

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:3000",
    ],
    credentials: true,
}))

//set up db

const connectDB = process.env.DB

mongoose.connect(connectDB, {
    useUnifiedTopology:true,
    useNewUrlParser:true
}, (err) => {
    if(err) return console.error(err)
    console.log("Db connected successfully")
})

// set up router

app.use("/auth", require("./routers/userRouter"))
app.use("/post", require("./routers/postRouter"));