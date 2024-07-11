const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');

router.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error trying to read notes file', err);
            return res.status(500).send('Error trying to read notes file');
        }
    })
})