//import express
const express = require('express')

//import router
const router = require('./routes')

//import bodyParser
const bodyParser = require('body-parser')

//init app
const app = express()

//define port
const port = 3100

//use body parser
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//define routes
app.use('/api', router)

//start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})