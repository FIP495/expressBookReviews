const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const getUsername = require('../session-handler.js').getUsername

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

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


// PUT request: Modify review
public_users.put("/review/post/:isbn", function(req, res) {
    const isbn = req.params.isbn;
    let review = req.body.review;
    let username = getUsername();
    let book = books[isbn];
    let reviews = book["reviews"];
    console.log(username);
    console.log(reviews)
    if (Object.keys(reviews).length == 0) {
        books[isbn]["reviews"][username] = review;
        return res.status(300).json(`Review from user ${username} created.`);
    } else if (username in reviews) {
        books[isbn]["reviews"][username] = review;
        return res.status(300).json(`Review from user ${username} updated.`);
    } else {
        books[isbn]["reviews"][username] = review;
        return res.status(300).json(`Review from user ${username} added.`);
    }
});

module.exports.general = public_users;
module.exports.authenticatedUser = authenticatedUser;
