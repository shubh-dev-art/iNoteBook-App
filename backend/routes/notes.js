const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


// Routes1: get all notes using: GET "/api/notes/fetchallnotes" . Login required
router.get('/fetchallnotes' , fetchuser, async (req , res) =>{

    // fetching notes wrt user
    try{
        const notes = await Notes.find({user: req.user})
        res.json(notes);

    }catch(error){
        console.error(error.message);
        res.status(500).send("Something went wrong!");
    }
})

// Routes2: Add notes using: POST "/api/notes/addnotes" . Login required
router.post('/addnotes' , fetchuser, [
    body('title','Enter a valid title and minimum length for username is 3.').isLength({min : 3}),
    body('description','Description must have a minimum length of 5 characters.').isLength({min : 5})
], async (req , res) =>{

    try{
        const {title, description, tag} = req.body;

        // if there are errors, return bad request and message
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        // saving notes with all details required
        const note = new Notes({
            title, description, tag, user: req.user
        })
        const savedNote = await note.save();
        res.json(savedNote);

    }catch(error){
        console.error(error.message);
        res.status(500).send("Something went wrong!");
    }
})

// Routes3: Update an existing notes using: PUT "/api/notes/updatenotes" . Login required
router.put('/updatenotes/:id' , fetchuser, async (req , res) =>{

    try{
        const {title, description, tag} = req.body;
    
        //Create a newnote object 
        const newNote = {};
        if(title){newNote.title = title}; 
        if(description){newNote.description = description}; 
        if(tag){newNote.tag = tag}; 

        // find existing notes by id and updating it
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Notes not found");
        }

        // verifying if the user updating his/her own notes or not
        if(note.user.toString() !== req.user){
            return res.status(401).send("Not Authorised");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.json({note});

    }catch(error){
        console.error(error.message);
        res.status(500).send("Something went wrong!");
    }
})

// Routes4: Delete an existing notes using: DELETE "/api/notes/deletenotes" . Login required
router.delete('/deletenotes/:id' , fetchuser, async (req , res) =>{
    try{
        
        // find existing notes by id and deleting it
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Notes not found");
        }

        // verifying if the user deleting his/her own notes or not
        if(note.user.toString() !== req.user){
            return res.status(401).send("Not Authorised");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success" : "Notes deleted successfully" , note: note});

    }catch(error){
        console.error(error.message);
        res.status(500).send("Something went wrong!");
    }
})

module.exports = router;