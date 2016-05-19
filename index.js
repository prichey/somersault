require('dotenv').config();

const rp = require('request-promise');
const express = require('express');
const low = require('lowdb');
const storage = require('lowdb/file-sync');

const app = express();
const port = process.env.PORT || 3000;

const db = low(`db/${process.env.BLOG_IDENTIFIER}.json`, { storage });

const tumblrUri = 'https://api.tumblr.com/v2';
const blogUri = `${tumblrUri}/blog/${process.env.BLOG_IDENTIFIER}`;

app.get('/', function(req, res) {
  res.send(db.object);
});

// currently drops db('info') and replaces it entirely
app.get('/info', function(req, res) {
  const blogInfoOptions = {
    uri: blogUri + '/info',
    qs: {
      api_key: process.env.API_KEY
    },
    json: true
  };

  rp(blogInfoOptions)
  .then(function(info) {
    db('info').remove({});
    db('info').push(info.response.blog);
    res.send(info);
  })
  .catch(function(err) {
    res.send(err);
  });
});

app.listen(port, function() {
  console.log(`App listening on localhost:${port}`);
});
