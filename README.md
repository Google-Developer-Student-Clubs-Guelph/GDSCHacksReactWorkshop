# Intro to React Workshop

## Note taking app

Clone URL: https://github.com/Google-Developer-Student-Clubs-Guelph/GDSCHacksReactWorkshop.git

1. **Introduction to React**

   - What is React and why use it?
   - Overview of single-page applications

2. **Setting Up the Development Environment**

   - Install Node.js and npm [Download here](https://nodejs.org/en/download)
   - Creating a new project `npm create vite@latest` [More info here](https://vitejs.dev/guide/)

> We'll be using a premade style sheet for the app. Here's the code for it:

```css
/* App.css */
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-inline: 2rem;
}

button {
  background-color: #166cdb;
  color: white;

  border: none;
  border-radius: 0.5rem;

  cursor: pointer;

  padding: 0.75rem 1.5rem; /* top-bottom, left-right */
}

button:hover {
  background-color: #0d4b9e;
}

.note-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  margin: 2rem;
}

.note-card {
  display: flex;
  flex-direction: column;

  background-color: #f4f4f4;
  padding: 0 2rem 2rem 2rem; /* top, right, bottom, left */

  margin: 1rem 0;

  border-radius: 0.5rem;
  cursor: pointer;

  width: 100%;
  max-width: 20rem;
}

.note-card:hover {
  background-color: #eaeaea;
}

.note-card button {
  background-color: #cc1821;
  margin-left: auto;
  margin-top: 2rem;
}

.note-card button:hover {
  background-color: #a40f15;
}

.editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  width: 100%;
  max-width: 50rem;
  margin-inline: auto;
}

.editor input,
.editor textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
}
```

<div style="page-break-after: always;"></div>

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
        <div className="note-card">
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

<div style="page-break-after: always;"></div>

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

      <textarea cols="30" rows="10" />
    </>
  );
}
```

<div style="page-break-after: always;"></div>

5. **State Management and Props**
   - useState hook
   - useEffect hook
   - Passing props to components

> The `useState` hook is a function that lets you add state to functional components. It returns an array with two elements: the current state value and a function that lets you update it.

> These stored values are called state variables. When a state variable changes, the component re-renders.

```jsx
// NoteEditor.jsx

export default function NoteEditor() {
  const [note, setNote] = useState({ name: "", content: "" });

  return (
    <>
      <input
        type="text"
        value={note.name}
        onChange={(e) => {
          const newNote = { ...note, name: e.target.value };
        }}
      />

      <textarea
        cols="30"
        rows="10"
        value={note.content}
        onChange={(e) => {
          const newNote = { ...note, content: e.target.value };
        }}
      />
    </>
  );
}
```

> The `useEffect` hook lets you perform side effects in functional components. The code inside `useEffect` runs whenever the variables in the provided dependency array change. If the dependency array is empty, the code runs only once when the component mounts.

> Here, we are using `useEffect` to load the note data from local storage when the component mounts or when the `noteId` prop changes. We then set the `name` and `content` state variables with the note data

> We are also using the `props` object to access the `noteId` prop passed to the `NoteEditor` component. Props are read-only and cannot be modified by the child component.

```jsx
// NoteEditor.jsx
export default function NoteEditor() {
  // ...

  // This must be put under the useState hook
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

  // ...
}
```

<div style="page-break-after: always;"></div>

6. **Handling Events**
   - Events in React
   - Passing around event handlers

> In React, you can pass functions as props to child components. So far we've used a few built-in props like `onClick` and `onChange`.

> Lets add an `onNoteChange` function to the `NoteEditor` component that will update the note data in local storage whenever the name or content of the note changes.

```jsx
// NoteEditor.jsx
export default function NoteEditor(props) {
  // ...

  // This goes under the useEffect hook
  function onNoteChange(newNote) {
    const notes = JSON.parse(localStorage.getItem("notes"));

    notes[props.noteId] = newNote;

    localStorage.setItem("notes", JSON.stringify(notes));

    setNote(newNote);
  }

  return (
    <>
      <input
        type="text"
        value={note.name}
        onChange={(e) => {
          const newNote = { ...note, name: e.target.value };

          onNoteChange(newNote); // add it here also
        }}
      />

      <textarea
        cols="30"
        rows="10"
        value={note.content}
        onChange={(e) => {
          const newNote = { ...note, content: e.target.value };

          onNoteChange(newNote); // add it here also
        }}
      />
    </>
  );
}
```

> We can also pass our own custom functional props to child components. Here, we are passing the `onSave` function as a prop to the `NoteEditor` component. This function will be called when the user clicks the "Save" button in the `NoteEditor` component.

```jsx
// NoteEditor.jsx
export default function NoteEditor(props) {
  // ...

  return (
    <>
      ...
      {/** This goes under the HTML textarea */}
      <button onClick={props.onSave}>Save</button>
    </>
  );
}
```

> So far we've created a `NoteEditor` component but there's a few missing pieces. We still need to define the `onSave` function and pass it as a prop to the `NoteEditor` component. As well as keeping track of the current note being edited.

```jsx
// App.jsx

function App() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState({});

  // Load notes from local storage
  function updateNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("notes"));

    if (savedNotes) {
      setNotes(savedNotes);
    }
  }

  // Grab the notes from local storage when the site loads
  useEffect(() => {
    updateNotes();
  }, []);

  return (
    <main>
      ...
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
    </main>
  );
}
```

> Now that we have an editor, lets add a way to create a new note.

```jsx
// App.jsx
function App() {
  // ...

  // This goes under the updateNotes hook
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

  // ...

  return (
    <main>
      <div className="heading">
        <h1>Notes App</h1>
        <button onClick={newNote}>Create New</button>
      </div>
      ...
    </main>
  );
}
```

<div style="page-break-after: always;"></div>

7. **Conditional Rendering**

   - Using conditional operators and logical && for conditional rendering
   - Handling lists and keys with map

   > If you've been following along, you might have noticed that things don't quite work right now. This is because at the beginning, the selectedNote is set to `null` and the `NoteEditor` component is trying to load a note with a `null` id.

   > We can fix this by only rendering the `NoteEditor` component when a note is selected.

```jsx
// App.jsx
function App() {
  // ...

  /**
   * If no note is selected, show the main page
   */
  if (!selectedNote) {
    return (
      <main>
        <div className="heading">
          <h1>Notes App</h1>
          <button onClick={newNote}>Create New</button>
        </div>

        <div className="note-container">...</div>
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

      <div className="editor">...</div>
    </main>
  );
}
```

> It also makes sense to show all the notes that we already have in local storage. We can use the `map` function to loop through the notes and render them.

> While we're at it, lets also add a delete note button to each note.

```jsx
function App() {
  // ...

  // This function goes under the newNote function and above the useEffect hook
  function deleteNote(noteId) {
    delete notes[noteId];

    localStorage.setItem("notes", JSON.stringify(notes));

    setSelectedNote(null);
    updateNotes();
  }

  // ...

  return (
    <main>
      ...
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
      ...
    </main>
  );
}
```

> And thats it! We've created a simple note taking app using React. We've learned about components, state management, props, conditional rendering and event handling.

> The complete code can be found in the `/src` directory of this repository.

<div style="page-break-after: always;"></div>

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

```jsx
// this is incorrect. We're not adding any dependencies
useEffect(() => {
  const user = session.user;
}, []); // incorrect

// this is the proper way to add dependencies
useEffect(() => {
  const user = session.user;
}, [session]); // correct
```

> If you're still having trouble debugging your React app, you can use the React Developer Tools. This is a browser extension that lets you inspect the component hierarchy, view the state and props of each component, and even modify the state and props in real-time.
