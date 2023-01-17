const express = require('express')
const Book = require('../models/book')
const router = express.Router()


router.get('/', async (req, res) => {    
    let searchOptions = {}

    if(req.query.name != null && req.query.name !== '' ) {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }

    try{
        const books = await Book.find(searchOptions)
        res.render('books/index', {books: books, searchOptions: req.query})
    }
    catch (err)
    {
        res.redirect('books/index', {
            errorMessage: `Error retrieving books`
        })
    }    
})

router.get('/new', (req, res) => {
    res.render('books/new', { book: new Book()})    
})

router.post('/', async (req, res) => {    

    const book = new Book({
        name: req.body.name
    })

    try {
        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    }
    catch (err)
    {
        res.render('books/new', {
            book: book,
            errorMessage: `Error creating book : ${book.name}`
        })
    }
})

module.exports = router