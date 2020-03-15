const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to Listee');
});

app.listen(3000, () => {
    console.log('Listee is listening to you on port 3000');
});