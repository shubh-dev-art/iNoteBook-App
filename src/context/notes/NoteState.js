import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) =>{
    const host = "http://localhost:5000"
    const notesInitial = []

    // Get all notes using API
    const getNotes = async () =>{
        // fetch API
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        setNotes(json);
    }

    const [notes, setNotes] = useState(notesInitial)

    // Add notes method
    const addNote = async (title, description, tag) =>{
        // fetch API
        const response = await fetch(`${host}/api/notes/addnotes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
        });
        const note = await response.json();
        setNotes(notes.concat(note));
    }


    // Delete notes method
    const deleteNote = async (id) =>{
        // fetch API
        const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = response.json();
        const newNotes = notes.filter((note) => {return note._id !== id})
        setNotes(newNotes);
    }


    // Edit notes method
    const editNote = async (id, title, description, tag) =>{
        // fetch API
        const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
        });
        const json = await response.json();
        
        // code for editing an existing note
        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === id){
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    }

    return(
        <NoteContext.Provider value = {{notes, getNotes, addNote, deleteNote, editNote}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;