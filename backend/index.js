require('dotenv').config()

const express = require("express");
const path = require('path')
const cors= require("cors");

const port = 3000;
const app = express();

const sauceRoutes= require('./routes/sauceRoute')
const userRoutes=require('./routes/userRoute')

///////database
require("./mongs")






///////////midlleware
app.use(cors());
app.use(express.json());
app.use('/api/sauces',sauceRoutes);
app.use('/api/auth',userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));






//////listen
app.listen(port, ()=> console.log('listen port'+port));

