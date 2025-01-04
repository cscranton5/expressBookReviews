const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    return users.some((user) => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
    return users.some((user) => { return (user.username === username && user.password === password) })
}

//only registered users can login
regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;


    if (username && password) {
        if (authenticatedUser(username, password)) {
            let accessToken = jwt.sign({
                data: username
            }, 'access', { expiresIn: 60 * 60 });

            // Store access token in session
            req.session.authorization = {
                accessToken
            }
            return res.status(200).send("User successfully logged in");
        } else {
            return res.status(422).json({ message: "Login Failed" });
        }
    } else {
        return res.status(400).json({ message: "username and-or password not given" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    

    const token = req.session.authorization["accessToken"];
    const secret = 'access'; // Replace with your secret key

    const decoded = jwt.verify(token, secret);
    
    const book = books[req.params.isbn];
    const username = decoded.data;
    const review = req.query.review;

    if (book && review) {
        book["reviews"][username] = review;
        res.status(200).json({ message: "review added" });
    } else {
        res.status(400).json({ message: "review failed" });
    }

});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const token = req.session.authorization["accessToken"];
    const secret = 'access';

    const decoded = jwt.verify(token, secret);
    const username = decoded.data;

    
    const book = books[req.params.isbn];

    if(book){
        delete book["reviews"][username];
        res.status(200).json({message:"Review deleted"})
    }else{
        res.status(300).json({message:"no review exist for given isbn"})
    }
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
