const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let doesExist = require("./auth_users.js").doesExist;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username == undefined) {
        return res.status(404).json({message: "Username not provided"});
    }
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(300).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  return res.status(300).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let books_by_author = Object.values(books).filter((book) => {return book["author"] == author;});
  return res.status(300).json(books_by_author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let details = Object.values(books).filter((book) => {return book["title"] == title;});
  return res.status(300).json(details);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  return res.status(300).json(books[isbn]["reviews"]);
});

// TASK 10 - Get all book details  using Promises
public_users.get('/books',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(books));
    });
    get_books.
        then(() => {console.log("Promise for Task 10 is resolved");});
});

// TASK 11 - Get book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
            if (req.params.isbn <= 10) {
            resolve(res.send(books[isbn]));
        } else {
            reject(res.send('ISBN not found'));
        }
    });
    get_books_isbn.
        then(function(){
            console.log("Promise for Task 11 is resolved");
    }).
        catch(() => {console.log('ISBN not found');
    });

});

// TASK 12 - Get book details based on author using Promises
public_users.get('/books/author/:author',function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {
        const author = req.params.author;
        let books_by_author = Object.values(books).filter((book) => {return book["author"] == author;});
        if (books_by_author) {
            resolve(res.send(books_by_author));
        } else {
           reject(res.send('author not found'));
        }
    });
    get_books_author.
        then(() => {console.log("Promise for Task 12 is resolved");
    }).
    catch(() =>{console.log('author not found');});

});

// TASK 13 - Get book details based on title using Promises
public_users.get('/books/title/:title',function (req, res) {
    const get_title_details = new Promise((resolve, reject) => {
        const title = req.params.title;
        let title_details = Object.values(books).filter((book) => {return book["title"] == title;});
        if (title_details) {
            resolve(res.send(title_details));
        } else {
           reject(res.send('title not found'));
        }
    });
    get_title_details.
        then(() => {console.log("Promise for Task 13 is resolved");
    }).
    catch(() => {console.log('title not found');});

});

module.exports.general = public_users;
