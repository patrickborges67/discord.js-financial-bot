const express = require('express');
const config = require('./config.json');
const api = require('./apiCall.js');

const app = express();
console.log(api);
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);