const express = require('express')
const path = require('path')
const { config } = require('dotenv')
config()
const bodyparser = require('body-parser')
const mongoose = require('mongoose')

const multer = require('multer') 
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'BE/storage/images')
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() +  '-' + file.originalname)
  }
}) 
const fileFilter = (req, file, callback) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

const app = express()

app.use(bodyparser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
  next()
})
app.use(multer({ storage: fileStorage, fileFilter }).single('image_path'))
app.use('/BE/storage/images', express.static(path.join(__dirname, 'storage/images')))

// custom routes
const authRoutes = require('./api/auth')
const userRoutes = require('./api/user')
const todosRoutes = require('./api/todos')

app.use('/api/auth', authRoutes)
app.use('/api', userRoutes)
app.use('/api', todosRoutes)

mongoose.connect(process.env.MONGODB_URI).then(() => {
  const server = app.listen(8080)
  const socket_io = require('./socket').init(server)
  
  socket_io.on('connection', socket => {
    console.log('Client connected!')
  })
}).catch(error => console.log(error))