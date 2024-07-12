// Grabs express
const express = require('express');
// Grabs path
const path = require('path');
// Crates a router using express
const router = express.Router();
// Grabs fs
const fs = require('fs');
// UUID is a dependency used for random generation of ID. 
const { v4: uuidv4 } = require('uuid');

// Grab the notes, check for an error. Then we JSON.parse the data.
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

/* A post with /notes. Check if there's any inputs so an error can be thrown.
    Then a file is read within the database and, if not, throws error. If it does go through,
    we create a new object from the pushed content. Then write a file into the database with
    the new object to store in the database.
*/
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


// Deletes a note with the selected id.
router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log('Error trying to read notes file', err);
            return res.status(500).send('Error trying to read notes file');
        }
        const notes = JSON.parse(data);
        const index = notes.findIndex(note => note.id === noteId);
        
// Checks if index is not equal to -1, which shows that the potential deleted note has been found.
        if (index !== -1) {
// We splice it so we can remove the element.
            notes.splice(index, 1);
// Then write the updated notes.
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