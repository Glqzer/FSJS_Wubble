import "../style.css";

const noteWallDiv = document.getElementById("notes-wall")
const noteCreationDiv = document.getElementById("new-note")


// Helper function to create a new array with Sticky Notes
function addNote(stickyNotesArray, text, id) {
    return [
        ...stickyNotesArray,
        { text: text, id: id },
    ];
}

function removeNote(stickyNotesArray, id) {
    return stickyNotesArray.filter((note) => note.id !== id)
}

function editNote(stickyNotesArray, newText, id) {
    const note = stickyNotesArray.find(note => note.id === id);
    note.text = newText;
    return stickyNotesArray;
}

// Create the basic layout of Sticky Notes
function createStickyNotesApp() {
    let stickyNotes = [];
    let nextStickyNoteId = 1;

    return {
        addNote: (newNoteText) => {
            stickyNotes = addNote(stickyNotes, newNoteText, nextStickyNoteId++);
        },
        removeNote: (noteId) => {
            stickyNotes = removeNote(stickyNotes, noteId);
        },
        editNote: (newNoteText, id) => {
            stickyNotes = editNote(stickyNotes, newNoteText, id);
        },
        getNotes: () => stickyNotes,
    };
}

const StickyNotesApp = createStickyNotesApp();

// Create the button for a new note
function createNoteButton(note) {
    const noteButton = document.createElement("button");
    noteButton.classList.add("absolute", "w-5", "h-5", "leading-5", "text-center", "transition-opacity", "opacity-0", "cursor-pointer", "delete-btn", "top-1", "right-1", "hover:opacity-100")
    noteButton.innerText = "🗑";
    noteButton.id = `sticky-note-${note.id}`;
    return noteButton;
}

// Create the text for a new note
function createNoteText(note) {
    const noteText = document.createElement("div");
    noteText.classList.add("p-4", "note-text");
    noteText.innerText = note.text;
    return noteText;
}

// Create the text area for a new note
function createNoteTextArea(note) {
    const noteTextArea = document.createElement("textarea");
    noteTextArea.classList.add("absolute", "top-0", "left-0", "hidden", "w-full", "h-full", "p-4", "transition-transform", "transform", "bg-yellow-300", "shadow-xl", "resize-none", "outline-rose-700", "outline-offset-0", "note-edit", "note", "hover:scale-105")
    noteTextArea.innerText = note.text;
    noteTextArea.id = `sticky-note-${note.id}`;
    return noteTextArea
}

// Format a new note using above functions
function createFormatNote(note) {
    const noteItem = document.createElement("div");
    noteItem.classList.add("relative", "w-40", "h-40", "p-0", "m-2", "overflow-y-auto", "transition-transform", "transform", "bg-yellow-200", "shadow-lg", "note", "hover:scale-105");
    noteItem.append(createNoteButton(note), createNoteText(note), createNoteTextArea(note));
    noteItem.id = `sticky-note-${note.id}`;
    return noteItem;
}

// Render all sticky notes
function renderStickyNotes() {
    noteWallDiv.innerHTML = "";
    const noteItems = StickyNotesApp.getNotes().map(createFormatNote);
    noteWallDiv.append(...noteItems);
}

// Handle the "enter" event
function newNoteEvent(event) {
    if ((event.key === "Enter" && !event.shiftKey) || event.key === "Escape") {
        const newNoteText = event.target.value.trim();
        event.preventDefault();
        if (newNoteText) {
            StickyNotesApp.addNote(newNoteText);
            noteCreationDiv.value = '';
            renderStickyNotes();
        } else {
            noteCreationDiv.value = '';
            renderStickyNotes();
        }
    }
}

// Find an ID of a note
function findNoteId(event) {
    return event.target.id?.includes("sticky-note") ? event.target : null;
}

// Parse the ID of a note
function parseId(note) {
    return (note ? Number(note.id.split("-").pop()) : -1);
}

// Handle note deletion
function removeNoteEvent(event) {
    if (event.target.classList.contains("delete-btn")) {
        StickyNotesApp.removeNote(parseId(findNoteId(event)));
        renderStickyNotes();
    }
}

// Handle double clicking
function editNoteEvent(event) {
    const noteElementDiv = event.target.parentElement;
    const noteInputArea = noteElementDiv.children[2];
    const noteText = noteElementDiv.children[1];
    noteInputArea.classList.remove("hidden");
    noteText.classList.add("hidden");

    noteInputArea.addEventListener("blur", (blurEvent) => {
        const newNoteText = noteInputArea.value.trim();
        const noteId = parseId(findNoteId(blurEvent));
        if (newNoteText) {
            StickyNotesApp.editNote(newNoteText, noteId);
        }
        renderStickyNotes(); // Re-render notes after editing
    });
}

// Handle finishing editing a note
function editNoteCompletedEvent(event) {
    if ((event.key === "Enter" && !event.shiftKey) || event.key === "Escape") {
        const noteId = parseId(findNoteId(event));
        const newNoteText = event.target.value.trim();
        if (newNoteText) {
            StickyNotesApp.editNote(newNoteText, noteId);
            renderStickyNotes();
        }
    }
}

// Event listeners
noteCreationDiv.addEventListener("keydown", newNoteEvent);
noteWallDiv.addEventListener("click", removeNoteEvent);
noteWallDiv.addEventListener("dblclick", editNoteEvent);
noteWallDiv.addEventListener("keydown", editNoteCompletedEvent);
document.addEventListener("DOMContentLoaded", renderStickyNotes);

// TODO: Spec 3
