const express = require('express');
const cors = require('cors')
require('dotenv').config();




const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(express.json());




module.exports = app;
// app.get('/',(req,res)=>{
//   res.sendFile(path.join(__dirname,'..','public','index.html'));//to serve the frontend on first page load
// })


