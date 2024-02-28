const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const uname=req.query.username;
  const pword=req.query.password;
  if (uname && pword){
    if (!isValid(uname)){
      users.push({"username":uname, "password":pword});
      return res.status(200).json({message: "USER SUCCESSFULLY REGISTERED. YOU CAN NOW LOGIN"});
    }
    else{
      return res.status(404).json({message: "USER ALREADY EXISTS"});
    }
  }
  return res.status(404).json({message: "UNABLE TO REGISTER USER"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try {
    const bookList=books;
    res.json(bookList);
  }
  catch (error){
    console.error(error);
    res.status(500).json({message: "ERROR RETRIEVING BOOK LIST"})
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  try{
    const requestISBN=req.params.isbn;
    const book=books[requestISBN]
    if (book){
      res.json(book);
    }
    else {
      res.status(404).json({message: "BOOK NOT FOUND"});

    }
  }
  catch (error){
    console.error(error);
    res.status(500).json({message: "ERROR RETRIEVING BOOK DETAILS"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  try {
    const requestAuthor=req.params.author;
    const matchingBooks=[];
    const bookKeys=Object.keys(books);
    for (const key of bookKeys){
      const book=books[key];
      if (book.author===requestAuthor){
        matchingBooks.push(book);
      }
    }
    if (matchingBooks.length>0){
      res.json(matchingBooks);
    }
    else{
      res.status(404).json({message: "NO BOOKS FOUND BY THAT AUTHOR"});
    }
  }
  catch (error){
    console.error(error)
    res.status(500).json({message: "ERROR RETRIEVING BOOKS"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try {
    const requestTitle=req.params.title;
    const matchingBooks=[];
    const bookKeys=Object.keys(books);
    for (const key of bookKeys){
      const book=books[key];
      if (book.title.toLowerCase()===requestTitle.toLowerCase()){
        matchingBooks.push(book);
      }
    }
    if (matchingBooks.length>0){
      res.json(matchingBooks);
    }
    else{
      res.status(404).json({message: "NO BOOKS FOUND BY THAT TITLE"});
    }
  }
  catch (error){
    console.error(error)
    res.status(500).json({message: "ERROR RETRIEVING BOOKS"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  try{
    const requestISBN=req.params.isbn;
    const book=books[requestISBN];
    if (book){
      const reviews=book.reviews;
      //if (reviews.length==0){
       // res.json({message: "NO REVIEW FOR THIS BOOK"})
      //}
      //else{
        res.json(reviews);
      //}
    }
    else{
      res.status(404).json({message: "BOOK NOT FOUND"});
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({message: "ERROR RETRIEVING BOOKS"})
  }
});

function getBookListWithPromise(url) {
return new Promise((resolve, reject) => {
  axios.get(url)
    .then(response => resolve(response.data))
    .catch(error => reject(error));
});
}

async function getBookListAsync(url) {
try {
  const response = await axios.get(url);
  return response.data;
} catch (error) {
  throw error; 
}
}


public_users.get('/promise', function (req, res) {
try {
  getBookListWithPromise('http://localhost:5000/') 
    .then(bookList => {
      res.json(bookList);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book list" });
    });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Unexpected error" });
}
});


public_users.get('/async', async function (req, res) {
try {
  const bookList = await getBookListAsync('http://localhost:5000/'); //
  res.json(bookList);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Error retrieving book list" });
}
});


public_users.get('/promise/isbn/:isbn', function (req, res) {
try {
  const requestedIsbn = req.params.isbn;
  getBookListWithPromise("http://localhost:5000/isbn/" + requestedIsbn) 
    .then(book => {
      res.json(book);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Unexpected error" });
}
});

public_users.get('/async/isbn/:isbn', async function (req, res) {
try {
  const requestedIsbn = req.params.isbn;
  const book = await getBookListAsync("http://localhost:5000/isbn/" + requestedIsbn);
  res.json(book);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Error retrieving book details" });
}
});

public_users.get('/promise/author/:author', function (req, res) {
try {
  const requestedAuthor = req.params.author;
  getBookListWithPromise("http://localhost:5000/author/" + requestedAuthor) 
    .then(book => {
      res.json(book);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Unexpected error" });
}
});

public_users.get('/async/author/:author', async function (req, res) {
try {
  const requestedAuthor = req.params.author;
  const book = await getBookListAsync("http://localhost:5000/author/" + requestedAuthor);
  res.json(book);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Error retrieving book details" });
}
});


public_users.get('/promise/title/:title', function (req, res) {
try {
  const requestedTitle = req.params.title;
  getBookListWithPromise("http://localhost:5000/title/" + requestedTitle) 
    .then(book => {
      res.json(book);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Unexpected error" });
}
});

public_users.get('/async/title/:title', async function (req, res) {
try {
  const requestedTitle = req.params.title;
  const book = await getBookListAsync("http://localhost:5000/title/" + requestedTitle);
  res.json(book);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Error retrieving book details" });
}
});
module.exports.general = public_users;
