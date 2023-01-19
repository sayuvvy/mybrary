const express = require('express')
const Book = require('../models/book')
const Author = require('../models/author')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Book.coverImageBasePath)
const router = express.Router()
const multer = require('multer')
const imageMimeTypes = ['image/jpeg', 'image/jpg','image/gif', 'image/png']

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))        
    }
})

router.get('/', async (req, res) => {    
    let searchOptions = {}

    if(req.query.title != null && req.query.title !== '' ) {
        searchOptions.title = new RegExp(req.query.title, 'i')
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

router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

router.post('/', upload.single('cover'), async (req, res) => {    
    const filename = (req.file != null)? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: filename,
        author: req.body.author
    })

    try {
        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`)
        res.redirect('/books')
    }
    catch (err)
    {
        if (book.coverImageName != null) {
            removeBook(filename)
        }

        console.error(err)
        //renderNewPage(res, book, true)
    }
})

function removeBook(fileName){
    fs.unlink(path.join(uploadPath, fileName), err=>{
        console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = `Error creating book : ${book.name}`
        res.render('books/new', params)
    }
    catch (err) {
        console.error(err)
        //res.redirect('/books')
    }
}

module.exports = router