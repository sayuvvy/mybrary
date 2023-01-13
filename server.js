if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const mongoose = require('mongoose')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open', ()=> console.log('connected successfully to mongoose'))

app.use(express.urlencoded())
app.use(express.json())

app.use(expressLayouts)
app.use(express.static('public'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)

app.listen(process.env.PORT || 3000)