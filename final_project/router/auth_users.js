const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"osjohn", "password":"osjohn01"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username=req.query.username;
  const password=req.query.password;
  if (!username || !password){
    return res.status(404).json({message: "ERROR LOGGIN IN"});
  }
  if (authenticatedUser(username,password)){
    let accessToken=jwt.sign({
      data:password
    }, 'access', { expiresIn: 60*60});
    req.session.authorization={
      accessToken,username
    }
    return res.status(200).send("USER SUCCESSFULLY LOGGED IN");
  }
  else{
    return res.status(200).json({message: "INVALID LOGIN!"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const requestedIsbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.session.authorization.username; 
    if (!username) {
      return res.status(401).json({ message: "Unauthorized" }); 
    }

    const book = books[requestedIsbn];

    if (book) {
      book.reviews[username] = reviewText; 
      res.json({ message: "Review added/modified successfully" });
    } else {
      res.status(404).json({ message: "Book not found" }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding/modifying review" }); 
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const requestedIsbn = req.params.isbn;
    const username = req.session.authorization.username; 

    if (!username) {
      return res.status(401).json({ message: "Unauthorized" }); 
    }

    const book = books[requestedIsbn];

    if (book) {
      if (book.reviews[username]) { 
        delete book.reviews[username]; 
        res.json({ message: "Review deleted successfully" });
      } else {
        res.status(404).json({ message: "Review not found" }); 
      }
    } else {
      res.status(404).json({ message: "Book not found" }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting review" }); 
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
