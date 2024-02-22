import './App.css'
import Button from './components/Button'
import NoteEditor from './NoteEditor'
import { useEffect, useState } from 'react'

function App() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState({});


  const updateNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));

    if (savedNotes) {
      setNotes(savedNotes);
    }
  }

  const newNote = () => {
    const id = Date.now().toString();
    notes[id] = {
      name: 'New Note',
      content: '',
    };

    localStorage.setItem('notes', JSON.stringify(notes));

    setSelectedNote(id);
    updateNotes();
  }

  const deleteNote = (noteId) => {
    delete notes[noteId];
    localStorage.setItem('notes', JSON.stringify(notes));
    setSelectedNote(null);
    updateNotes();
  }

  useEffect(() => {
    updateNotes();
  }, [])

  return (
    <main>
      {!selectedNote ? (
        <>
          <div className='heading'>
            <h1>Notes App</h1>
            <Button onClick={newNote}>Create New</Button>
          </div>

          <div className='note-container'>
            {
              Object.keys(notes).map((noteId) => {
                console.log(notes[noteId])
                return (
                  <div className='note-card' key={noteId} onClick={() => setSelectedNote(noteId)}>
                    <h2>{notes[noteId].name}</h2>
                    <p>{notes[noteId].content.slice(0, 100)}</p>
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(noteId)
                    }}>Delete</Button>
                  </div>
                )
              })
            }

          </div>
        </>
      )
        :
        (
          <>
            <h1>Edit Note</h1>
            <div className='editor'>
              <NoteEditor noteId={selectedNote} onSave={() => {
                setSelectedNote(null)
                updateNotes()
              }}></NoteEditor>
            </div>
          </>
        )}
    </main>
  )
}

export default App
