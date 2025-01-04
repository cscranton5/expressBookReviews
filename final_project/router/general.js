const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
    const username = req.body.username;
    const password = req.body.password;
    if(username && password){
        if(!isValid(username)){
            users.push({"username":username, "password":password})
            return res.status(200).json({message: `User: ${username} Created Successfully`})
        }else{
            return res.status(422).json({message: `error creating user: ${username}`});
        }    
    }else {
        return res.status(400).json({message: 'Username and-or password not provided'})
    }
    
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

    bookPromise = new Promise ((resolve, reject) => {
        resolve(books)
    });

    bookPromise.then((books) => {
        res.status(200).send(JSON.stringify(books, null, 4));
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const isbn = req.params.isbn

    bookPromise = new Promise((resolve,reject) => {
        resolve(books[isbn])
    })

    bookPromise.then((book) => {
        res.status(201).send(book);
    }) 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    bookPromise = new Promise((resolve, reject) => {
    authorToFind = req.params.author;

    if(authorToFind){
        
        let booksArray = Object.values(books);
        
        let booksByAuthor = booksArray.filter(book => book.author === authorToFind);
        resolve(booksByAuthor);
    }else {
        reject("no Author given")
    }
  });

  bookPromise.then((result) => {
    res.status(200).send(JSON.stringify(result, null, 4));
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
    bookPromise = new Promise((resolve, reject) => {
        let titleToFind = req.params.title;

        let booksArray = Object.values(books);

        let title = req.params.title;
        let booksByTitle = booksArray.filter(book => book.title === title);

        resolve(booksByTitle);

    })
    
   bookPromise.then((booksByTitle) => {
        res.status(200).send(JSON.stringify(booksByTitle, null, 4));
   })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    
    const book = books[req.params.isbn];

  return res.status(200).send(JSON.stringify(book["reviews"], null, 4));
});

module.exports.general = public_users;
