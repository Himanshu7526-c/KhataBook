
const express = require('express');
const app = express();
const path=require("path")
const cookieParser = require("cookie-parser")

require("dotenv").config()

const indexRouter = require('./routes/indexRouter')
const hisaabRouter=require("./routes/hisaabRouter.js")
const dbConnect = require("./config/mongoose-connection")
dbConnect();// 

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname,"public"))) 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/",indexRouter)
app.use("/hisaab", hisaabRouter)
app.listen(process.env.PORT || 3000)
