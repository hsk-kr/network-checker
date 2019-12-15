const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const {
  NC_PORT,
  NC_DB_HOST,
  NC_DB_PORT,
  NC_DB_NAME
} = process.env;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// register routes
app.use(require('./routes'));

app.listen(NC_PORT, async () => {
  // connect database
  await mongoose.connect(
    `mongodb://${NC_DB_HOST}:${NC_DB_PORT}/${NC_DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  console.log(`server has started. port number: ${NC_PORT}`);
});