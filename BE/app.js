const express = require('express')
const { config } = require('dotenv')
config()
const bodyparser = require('body-parser')
const { default: mongoose } = require('mongoose')

const app = express()

app.use(bodyparser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
  next()
})

mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(8080)
}).catch(error => console.log(error))