const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

router.get('/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error trying to read notes file', err);
            return res.status(500).send('Error trying to read notes file');
        } else {
            try {
                const jsonData = JSON.parse(data);
                res.json(jsonData);
            } catch (error) {
                console.error('Error parsing JSON data', error);
                return res.status(500).send('Error parsing JSON data');
            }
        }
    })
})

router.post('/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    if (!title || !text) {
        return res.status(400).json({ error: 'Title and text are required for a new note' })
    }

    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log('Error trying to read notes file', err);
            return res.status(500).send('Error trying to read notes file');
        } else {
            let notes = JSON.parse(data);

            const newNote = {
                id: uuidv4(),
                title,
                text
            };

            notes.push(newNote);

            fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), (err) => {
                if (err) {
                    console.log('Error trying to write notes file', err);
                    return res.status(500).send('Error trying to write notes file');
                }
                res.json(newNote);
            })
        }
    })
})

router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log('Error trying to read notes file', err);
            return res.status(500).send('Error trying to read notes file');
        }
        const notes = JSON.parse(data);
        const index = notes.findIndex(note => note.id === noteId);
        
        if (index !== -1) {
            notes.splice(index, 1);

            fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), (err) => {
                if (err) {
                    console.log('Error trying to write notes file', err);
                    return res.status(500).send('Error trying to write notes file');
                }
                res.json({ message: 'Note deleted successfully' })
            })
        } else {
            console.log('Note not found');
            return res.status(404).send('Note not found');
        }
    })
})



module.exports = router;