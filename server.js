const express = require('express');

const PORT = 4000;
// creates express server
const server = express()
  .use(express.static('public')) // serve static assets (html, js, etc) from the public folder
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


