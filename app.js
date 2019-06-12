const express = require('express');
const database = require('./utils/database');
const db = database();

const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
