import { useState, useEffect } from "react";

/**
 * NoteEditor component
 *
 * This component is responsible for editing a note
 *
 * It takes a noteId prop which is the id of the note being edited
 * and an onSave prop which is a function to call when the note is saved.
 */
export default function NoteEditor(props) {
  const [note, setNote] = useState({ name: "", content: "" });

  /**
   * When the component mounts, we get the note from localStorage
   */
  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem("notes"));

    let note = notes[props.noteId];

    if (note) {
      setNote(note);
    } else {
      setNote({
        name: "New Note",
        content: "No content yet",
      });
    }
  }, [props.noteId]);

  /**
   * Function to handle note change
   */
  function onNoteChange(newNote) {
    const notes = JSON.parse(localStorage.getItem("notes"));

    notes[props.noteId] = newNote;

    localStorage.setItem("notes", JSON.stringify(notes));

    setNote(newNote);
  }

  /**
   * Render the component
   */
  return (
    <>
      <input
        type="text"
        value={note.name}
        onChange={(e) => {
          const newNote = { ...note, name: e.target.value };

          onNoteChange(newNote);
        }}
      />

      <textarea
        cols="30"
        rows="10"
        value={note.content}
        onChange={(e) => {
          const newNote = { ...note, content: e.target.value };

          onNoteChange(newNote);
        }}
      />

      <button onClick={props.onSave}>Save</button>
    </>
  );
}
