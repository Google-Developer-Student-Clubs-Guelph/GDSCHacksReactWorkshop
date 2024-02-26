import React from 'react';
import { useState, useEffect } from 'react';

export default function NoteEditor(props) {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const notes = JSON.parse(localStorage.getItem('notes'));

        console.log(notes)

        let note = notes[props.noteId];
        console.log(props.noteId, note)

        setName(note.name);
        setContent(note.content);
    }, [props.noteId])

    const onNoteChange = (name, content) => {
        const notes = JSON.parse(localStorage.getItem('notes'));

        console.log(props.noteId, name, content)

        notes[props.noteId] = {
            name,
            content,
        };

        localStorage.setItem('notes', JSON.stringify(notes));
    }


    return (
        <>
            <input type="text" value={name} onChange={(e) => {
                setName(e.target.value)
                onNoteChange(e.target.value, content)
            }} />
            <textarea
                cols="30"
                rows="10"
                value={content}
                onChange={(e) => {
                    setContent(e.target.value)
                    onNoteChange(name, e.target.value)
                }}
            ></textarea>
            <button onClick={props.onSave}>Save</button>
        </>
    )
}