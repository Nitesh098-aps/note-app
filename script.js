document.addEventListener("DOMContentLoaded", () => {
    const noteInputs = [document.getElementById("noteInputTop"), document.getElementById("noteInputBottom")];
    const addNoteButtons = [document.getElementById("addNoteBtnTop"), document.getElementById("addNoteBtnBottom")];
    const notesContainer = document.getElementById("notesContainer");
    const emptyMessage = document.getElementById("emptyMessage");

    loadNotes();

    noteInputs.forEach((noteInput, index) => {
        noteInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                if (event.shiftKey) {
                    event.preventDefault();
                    addNote(noteInput.value.trim());
                    saveNotes();
                    noteInput.value = "";
                } else {
                    event.preventDefault();
                    noteInput.value += "\n";
                }
            }
        });

        addNoteButtons[index].addEventListener("click", () => {
            const noteText = noteInput.value.trim();
            if (noteText !== "") {
                addNote(noteText);
                saveNotes();
                noteInput.value = "";
            }
        });
    });

    function addNote(text, save = true) {
        if (!text) return;
        emptyMessage.style.display = "none";

        const note = document.createElement("div");
        note.classList.add("note", "p-3", "flex", "justify-between");

        note.innerHTML = `
            <div class="note-text">${text}</div>
            <div class="space-x-2">
                <button class="edit-btn px-2 py-1">Edit</button>
                <button class="delete-btn px-2 py-1">Delete</button>
            </div>
        `;

        notesContainer.appendChild(note);

        // Edit Note Inline
        note.querySelector(".edit-btn").addEventListener("click", () => {
            const noteTextDiv = note.querySelector(".note-text");
            const textArea = document.createElement("textarea");
            textArea.value = noteTextDiv.innerText;
            textArea.classList.add("w-full");

            note.replaceChild(textArea, noteTextDiv);
            textArea.focus();

            textArea.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    const newText = textArea.value.trim();
                    if (newText !== "") {
                        noteTextDiv.innerText = newText;
                        note.replaceChild(noteTextDiv, textArea);
                        saveNotes();
                    }
                }
            });

            textArea.addEventListener("blur", () => {
                noteTextDiv.innerText = textArea.value.trim();
                note.replaceChild(noteTextDiv, textArea);
                saveNotes();
            });
        });

        // Delete Note
        note.querySelector(".delete-btn").addEventListener("click", () => {
            note.remove();
            saveNotes();
            checkEmptyState();
        });

        if (save) saveNotes();
    }

    function saveNotes() {
        const notes = [];
        document.querySelectorAll(".note-text").forEach(note => notes.push(note.innerText));
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function loadNotes() {
        const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
        if (savedNotes.length === 0) {
            emptyMessage.style.display = "block";
        } else {
            emptyMessage.style.display = "none";
            savedNotes.forEach(noteText => addNote(noteText, false));
        }
    }

    function checkEmptyState() {
        if (notesContainer.children.length === 1) {
            emptyMessage.style.display = "block";
        }
    }
});
