const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const getUsername = require('../session-handler.js').getUsername
const sessionManager = require('../session-handler.js');

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

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

// Login endpoint
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        sessionManager.setSession(req.session);
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// PUT request: Modify review
regd_users.put("/review/post/:isbn", function(req, res) {
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

// DELETE request: 
regd_users.delete("/review/delete/:isbn", (req, res) => {
    // Extract email parameter from request URL
    const isbn = req.params.isbn;

    if (isbn) {
        books[isbn]["reviews"] = {};
    }
    
    // Send response confirming deletion of friend
    res.send(`removed review of book with isbn ${isbn}.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.doesExist = doesExist;
