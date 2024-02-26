# Lesson Plan: React

## Note taking app

1. **Introduction to React**

   - What is React and why use it?
   - Overview of single-page applications

2. **Setting Up the Development Environment**

   - Install Node.js and npm
   - npm - create-react-app

3. **JSX: JavaScript**
   - Understanding JSX syntax
   - Embedding things in JSX (variables, functions)

> With JSX, you can write HTML elements in JavaScript and place them in the DOM without any `createElement()` and `appendChild()` methods. JSX makes it easier to write and add HTML in React.

```jsx
// App.jsx
function App() {
  return (
    <main>
      <div className="heading">
        <h1>Notes App</h1>
        <button>Create New</button>
      </div>

      <div className="note-container">
        <div>
          <h2>Note 1</h2>
          <p>A bit of text from the note</p>
          <button>Delete</button>
        </div>
      </div>

      <h1>Edit Note</h1>
      <div className="editor">{/* Code for Note Editor */}</div>
    </main>
  );
}

export default App;
```

4. **Components**
   - What are components?
   - Creating and using components

> Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

> Using the `<>` and `</>` tags, you can return multiple elements from a component.

```jsx
// NoteEditor.jsx
export default function NoteEditor() {
  return (
    <>
      <input type="text" />
      <textarea cols="30" rows="10"></textarea>
      <button onClick={props.onSave}>Save</button>
    </>
  );
}
```

5. **State Management and Props**
   - useState hook
   - useEffect hook
   - Passing props to components

> The `useState` hook is a function that lets you add state to functional components. It returns an array with two elements: the current state value and a function that lets you update it.

> These stored values are called state variables. When a state variable changes, the component re-renders.

```jsx
// NoteEditor.jsx

export default function NoteEditor() {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    return (
        <>
            <input ... value={name} onChange={(e) => setName(e.target.value)} />
            <textarea
                ...
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            ---
        </>
    )
}

```

> The `useEffect` hook lets you perform side effects in functional components. The code inside `useEffect` runs whenever the variables in the provided dependency array change. If the dependency array is empty, the code runs only once when the component mounts.

> Here, we are using `useEffect` to load the note data from local storage when the component mounts or when the `noteId` prop changes. We then set the `name` and `content` state variables with the note data

> We are also using the `props` object to access the `noteId` prop passed to the `NoteEditor` component. Props are read-only and cannot be modified by the child component.

```jsx
// NoteEditor.jsx
export default function NoteEditor() {
    ...

    useEffect(() => {
        const notes = JSON.parse(localStorage.getItem('notes'));

        console.log(notes)

        let note = notes[props.noteId];
        console.log(props.noteId, note)

        setName(note.name);
        setContent(note.content);
    }, [props.noteId]);


    ...
}
```

6. **Handling Events**
   - Events in React
   - Passing around event handlers

> In React, you can pass functions as props to child components. So far we've used a few built-in props like `onClick` and `onChange`.

> Lets add an `onNoteChange` function to the `NoteEditor` component that will update the note data in local storage whenever the name or content of the note changes.

```jsx
// NoteEditor.jsx
export default function NoteEditor(props) {
   ...

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
            <input ... onChange={(e) => {
                setName(e.target.value)
                onNoteChange(e.target.value, content)
            }} />
            <textarea
                ...
                onChange={(e) => {
                    setContent(e.target.value)
                    onNoteChange(name, e.target.value)
                }}
            ></textarea>
            ...
        </>
    )
}
```

> We can also pass our own custom functional props to child components. Here, we are passing the `onSave` function as a prop to the `NoteEditor` component. This function will be called when the user clicks the "Save" button in the `NoteEditor` component.

```jsx
// NoteEditor.jsx
export default function NoteEditor(props) {
    ...

    return (
        <>
            ...
            <button onClick={props.onSave}>Save</button>
        </>
    )
}
```

> So far we've created a `NoteEditor` component but there's a few missing pieces. We still need to define the `onSave` function and pass it as a prop to the `NoteEditor` component. As well as keeping track of the current note being edited.

```jsx
// App.jsx

function App() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState({});


  const updateNotes = () => {
   // Load notes from local storage
    const savedNotes = JSON.parse(localStorage.getItem('notes'));

    if (savedNotes) {
      setNotes(savedNotes);
    }
  }

   // Grab the notes from local storage when the site loads
  useEffect(() => {
    updateNotes();
  }, [])

  return (
    <main>

      <div className='heading'>
         <h1>Notes App</h1>
         <button>Create New</button>
      </div>

      <div className='note-container'>
      ...
      </div>


      <h1>Edit Note</h1>
      <div className='editor'>
         <NoteEditor noteId={selectedNote} onSave={() => {
            setSelectedNote(null)
            updateNotes()
         }}></NoteEditor>
      </div>

    </main>
  )
}
...
```

> Now that we have an editor, lets add a way to create a new note.

```jsx
// App.jsx
function App() {
  ...

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

  ...

  return (
    <main>
      <div className='heading'>
         <h1>Notes App</h1>
         <button onClick={newNote}>Create New</button>
      </div>

      ...
    </main>
  )
}
```

7. **Conditional Rendering**

   - Using conditional operators and logical && for conditional rendering
   - Handling lists and keys with map

   > If you've been following along, you might have noticed that things don't quite work right now. This is because at the beginning, the selectedNote is set to `null` and the `NoteEditor` component is trying to load a note with a `null` id.

   > We can fix this by only rendering the `NoteEditor` component when a note is selected.

   > To conditionally render a component, you can use the `&&` operator. Since it only make sense to render the rest of the app when a note isn't being edited, we can use the ternary operator `? :` to conditionally render the `NoteEditor` component.

```jsx
// App.jsx
function App() {
  ...

  return (
    <main>
      {!selectedNote ? (
        <>
          <div className='heading'>
            <h1>Notes App</h1>
            <button onClick={newNote}>Create New</button>
          </div>

          <div className='note-container'>
            ...

          </div>
        </>
      )
        :
        (
          <>
            <h1>Edit Note</h1>
            <div className='editor'>
              <NoteEditor ... ></NoteEditor>
            </div>
          </>
        )}
    </main>
  )
}
```

> It also makes sense to show all the notes that we already have in local storage. We can use the `map` function to loop through the notes and render them.

> While we're at it, lets also add a delete note button to each note.

```jsx
function App() {
  ...

  const deleteNote = (noteId) => {
    delete notes[noteId];
    localStorage.setItem("notes", JSON.stringify(notes));
    setSelectedNote(null);
    updateNotes();
  };

  ...

  return (
    <main>
      ...
      <div className="note-container">
        {Object.keys(notes).map((noteId) => {
          console.log(notes[noteId]);
          return (
            <div
              className="note-card"
              key={noteId}
              onClick={() => setSelectedNote(noteId)}
            >
              <h2>{notes[noteId].name}</h2>
              <p>{notes[noteId].content.slice(0, 100)}</p>
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
      ...
    </main>
  );
}
```

> And thats it! We've created a simple note taking app using React. We've learned about components, state management, props, conditional rendering and event handling.

> Here's the complete code for the app:

```jsx
// App.jsx
import "./App.css";
import NoteEditor from "./NoteEditor";
import { useEffect, useState } from "react";

function App() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState({});

  const updateNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem("notes"));

    if (savedNotes) {
      setNotes(savedNotes);
    }
  };

  const newNote = () => {
    const id = Date.now().toString();
    notes[id] = {
      name: "New Note",
      content: "",
    };

    localStorage.setItem("notes", JSON.stringify(notes));

    setSelectedNote(id);
    updateNotes();
  };

  const deleteNote = (noteId) => {
    delete notes[noteId];
    localStorage.setItem("notes", JSON.stringify(notes));
    setSelectedNote(null);
    updateNotes();
  };

  useEffect(() => {
    updateNotes();
  }, []);

  return (
    <main>
      {!selectedNote ? (
        <>
          <div className="heading">
            <h1>Notes App</h1>
            <button onClick={newNote}>Create New</button>
          </div>

          <div className="note-container">
            {Object.keys(notes).map((noteId) => {
              console.log(notes[noteId]);
              return (
                <div
                  className="note-card"
                  key={noteId}
                  onClick={() => setSelectedNote(noteId)}
                >
                  <h2>{notes[noteId].name}</h2>
                  <p>{notes[noteId].content.slice(0, 100)}</p>
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
        </>
      ) : (
        <>
          <h1>Edit Note</h1>
          <div className="editor">
            <NoteEditor
              noteId={selectedNote}
              onSave={() => {
                setSelectedNote(null);
                updateNotes();
              }}
            ></NoteEditor>
          </div>
        </>
      )}
    </main>
  );
}

export default App;
```

```jsx
// NoteEditor.jsx
import React from "react";
import { useState, useEffect } from "react";

export default function NoteEditor(props) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem("notes"));

    console.log(notes);

    let note = notes[props.noteId];
    console.log(props.noteId, note);

    setName(note.name);
    setContent(note.content);
  }, [props.noteId]);

  const onNoteChange = (name, content) => {
    const notes = JSON.parse(localStorage.getItem("notes"));

    console.log(props.noteId, name, content);

    notes[props.noteId] = {
      name,
      content,
    };

    localStorage.setItem("notes", JSON.stringify(notes));
  };

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          onNoteChange(e.target.value, content);
        }}
      />
      <textarea
        cols="30"
        rows="10"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          onNoteChange(name, e.target.value);
        }}
      ></textarea>
      <button onClick={props.onSave}>Save</button>
    </>
  );
}
```

**Common Errors and Debugging**

- Common pitfalls (e.g., updating state correctly, dependencies in useEffect)
- Using React Developer Tools

> Most of the time, when you're working with React, you'll be dealing with state and props. It's important to remember that state updates are asynchronous and may not be reflected immediately. This can lead to unexpected behavior if you're not careful.

> For example, if you're trying to update the state based on the previous state, you should use the functional form of `setState` to ensure that you're working with the latest state.

```jsx
const [count, setCount] = useState(0);

// This is incorrect
setCount(count + 1);

// This is correct
setCount((prevCount) => prevCount + 1);
```

> Another common mistake is forgetting to add dependencies to the `useEffect` hook. If you don't add dependencies, the code inside `useEffect` will run every time the component re-renders. This can lead to performance issues and unexpected behavior.

> If you're still having trouble debugging your React app, you can use the React Developer Tools. This is a browser extension that lets you inspect the component hierarchy, view the state and props of each component, and even modify the state and props in real-time.
