const express = require('express');

const app = express();

app.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
  });


const server = app.listen(8000, () => {
    console.log('Server is running on port 8000');
    });