require('dotenv').config();
const rp = require('request-promise');
const low = require('lowdb');
const storage = require('lowdb/file-sync');

const db = low(`db/${process.env.BLOG_IDENTIFIER}.json`, { storage });

const tumblrUri = 'https://api.tumblr.com/v2/';
const blogInfoUri = tumblrUri + 'blog/' + process.env.BLOG_IDENTIFIER + '/info';
const blogInfoOptions = {
  uri: blogInfoUri,
  qs: {
    api_key: process.env.API_KEY
  },
  json: true
};

rp(blogInfoOptions)
  .then(function(info) {
    console.log(info);
    db('info').remove({});
    db('info').push(info.response.blog);
  })
  .catch(function(err) {
    console.log(err);
  });
