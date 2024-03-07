// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const commentsPath = path.join(__dirname, 'comments.json');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/comments', (req, res) => {
  fs.readFile(commentsPath, (err, data) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});
app.post('/comments', (req, res) => {
  fs.readFile(commentsPath, (err, data) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    const comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile(commentsPath, JSON.stringify(comments), (err) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  });
});
app.listen(3000, () => {
  console.log('Server started');
});
// Path: public/index.html
<!DOCTYPE html>
<html>
  <head>
    <title>Comments</title>
  </head>
  <body>
    <h1>Comments</h1>
    <form id="commentForm">
      <input type="text" id="name" placeholder="Your name" required>
      <input type="text" id="comment" placeholder="Your comment" required>
      <button type="submit">Submit</button>
    </form>
    <ul id="comments"></ul>
    <script>
      const comments = document.getElementById('comments');
      const commentForm = document.getElementById('commentForm');
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const comment = document.getElementById('comment').value;
        fetch('/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name, comment})
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();