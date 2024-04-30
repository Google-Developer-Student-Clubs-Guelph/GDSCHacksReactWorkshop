import "./App.css";
import NoteEditor from "./NoteEditor";
import { useEffect, useState } from "react";

/**
 * Main App component
 *
 * This component is the main component for the Notes App
 */
function App() {
  /**
   * State to keep track of the notes and the selected note (the note being edited)
   */
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState({});

  /**
   * Function to update the notes
   *
   * We get the notes from localStorage
   *
   * If there are notes saved, we set the notes state to the saved notes
   *
   * We call this function when the component mounts, when we create a new note,
   * and when we delete a note.
   *
   */
  function updateNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("notes"));

    if (savedNotes) {
      setNotes(savedNotes);
    }
  }

  /**
   * Function to create a new note
   *
   * We create a new note object with a unique id
   *
   * We then add this note to the notes object
   *
   * We then save the updated notes object to localStorage
   *
   * We then set the selected note to the new note
   *
   * Finally we update the notes
   */
  function newNote() {
    const id = Date.now().toString();

    notes[id] = {
      name: "New Note",
      content: "",
    };

    localStorage.setItem("notes", JSON.stringify(notes));

    setSelectedNote(id);
    updateNotes();
  }

  /**
   * Function to delete a note
   *
   * We delete the note from the notes object
   *
   * We then save the updated notes object to localStorage
   *
   * We then reset the selected note to null
   *
   * Finally we update the notes
   */
  function deleteNote(noteId) {
    delete notes[noteId];

    localStorage.setItem("notes", JSON.stringify(notes));

    setSelectedNote(null);
    updateNotes();
  }

  /**
   * When the component mounts, we update the notes
   *
   * This will load the notes from localStorage
   */
  useEffect(() => {
    updateNotes();
  }, []);

  /**
   * If we're currently not editing a note, show the list of notes
   *
   * Object.keys(notes) returns an array of keys in the notes object
   *
   * We then map over this array of keys to render each note
   */
  if (!selectedNote) {
    return (
      <main>
        {/**
         *
         * The heading and the create new button
         *
         */}
        <div className="heading">
          <h1>Notes App</h1>
          <button onClick={newNote}>Create New</button>
        </div>

        {/**
         *
         * The list of notes
         *
         */}
        <div className="note-container">
          {Object.keys(notes).map((noteId) => {
            return (
              <div
                className="note-card"
                key={noteId}
                onClick={() => setSelectedNote(noteId)}
              >
                <h2>{notes[noteId].name}</h2>
                <p>{notes[noteId].content}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    deleteNote(noteId);
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </main>
    );
  }

  /**
   * Otherwise return the editor
   */
  return (
    <main>
      <div className="heading">
        <h1>Edit Note</h1>
      </div>

      <div className="editor">
        <NoteEditor
          noteId={selectedNote}
          onSave={() => {
            setSelectedNote(null);
            updateNotes();
          }}
        />
      </div>
    </main>
  );
}

export default App;
