// defining express
const express = require('express');
// defining path
const path = require('path');
// defining api from the notes.js within the routes folder.
const api = require('./routes/notes.js');

// putting app as a variable that is considered express();
const app = express();
// Making port number, also process.env.PORT is useful for render.
const PORT = process.env.PORT || 3001;

// creating middleware below
app.use(express.json());
app.use(express.urlencoded( {extended: true }));
app.use(express.static('public'));
// to use middleware to a specific path
app.use('/api', api);

/* gets the '/notes' and console logs if recieved, and if it does, respond with
    a send file of a joined path between __dirname and public/notes.html 
*/
app.get('/notes', (req, res) => {
    console.log('Notes from public/notes.html receieved');
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})

// just listens if the port ran through and if it does console.logs it.
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})
