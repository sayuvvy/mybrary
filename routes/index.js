const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    //res.send('Hello my first node server')
    res.render('index')
})

module.exports = router