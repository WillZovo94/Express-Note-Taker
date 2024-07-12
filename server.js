const express = require('express');
const path = require('path');
const api = require('./routes/notes.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded( {extended: true }));

app.use(express.static('public'));

app.use('/api', api);

/*
app.get('*', (req, res) => {
    console.log('stuff from public/index.html file');
    res.sendFile(path.join(__dirname, 'public/index.html'))
})
*/
app.get('/notes', (req, res) => {
    console.log('Notes from public/notes.html receieved');
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})
