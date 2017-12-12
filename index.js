const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const router = require('./routes/router');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(router);

const port = process.env.PORT || 8080;

app.listen(port, () => 
  console.log('listening on port 8080')
);