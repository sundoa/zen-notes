let currentUser = null;
let currentFolder = null;
let currentNote = null;
let autoSaveEnabled = true;

/* ---------- ELEMENTS ---------- */

const authScreen = document.getElementById("authScreen");
const app = document.getElementById("app");

const authButton = document.getElementById("authButton");
const toggleAuth = document.getElementById("toggleAuth");
const authTitle = document.getElementById("authTitle");
const authError = document.getElementById("authError");

const folderList = document.getElementById("folderList");
const notesList = document.getElementById("notesList");

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");

const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const saveStatus = document.getElementById("saveStatus");

/* ---------- AUTH ---------- */

let isSignup = false;

toggleAuth.onclick = () => {
    isSignup = !isSignup;
    authTitle.textContent = isSignup ? "Sign Up" : "Sign In";
    authButton.textContent = isSignup ? "Create Account" : "Sign In";
};

authButton.onclick = () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (isSignup) {
        if (users[username]) {
            authError.textContent = "User exists.";
            return;
        }
        users[username] = { password, folders: {} };
        localStorage.setItem("users", JSON.stringify(users));
        authError.textContent = "Account created!";
    } else {
        if (!users[username] || users[username].password !== password) {
            authError.textContent = "Invalid login.";
            return;
        }
        currentUser = username;
        localStorage.setItem("session", username);
        startApp();
    }
};

function startApp() {
    authScreen.classList.add("hidden");
    app.classList.remove("hidden");
    loadFolders();
}

/* ---------- DATA ---------- */

function getUserData() {
    let users = JSON.parse(localStorage.getItem("users")) || {};
    return users[currentUser];
}

function saveUserData(data) {
    let users = JSON.parse(localStorage.getItem("users")) || {};
    users[currentUser] = data;
    localStorage.setItem("users", JSON.stringify(users));
}

/* ---------- FOLDERS ---------- */

document.getElementById("newFolderBtn").onclick = () => {
    let name = prompt("Folder name:");
    if (!name) return;
    let data = getUserData();
    data.folders[name] = [];
    saveUserData(data);
    loadFolders();
};

function loadFolders() {
    folderList.innerHTML = "";
    let data = getUserData();
    Object.keys(data.folders).forEach(folder => {
        let li = document.createElement("li");
        li.textContent = folder;
        li.onclick = () => {
            currentFolder = folder;
            loadNotes();
        };
        folderList.appendChild(li);
    });
}

/* ---------- NOTES ---------- */

function loadNotes() {
    notesList.innerHTML = "";
    let data = getUserData();
    let notes = data.folders[currentFolder] || [];

    notes.forEach(note => {
        let li = document.createElement("li");
        li.textContent = note.title || "Untitled";
        li.onclick = () => openNote(note.id);
        notesList.appendChild(li);
    });
}

function openNote(id) {
    let data = getUserData();
    let notes = data.folders[currentFolder];
    let note = notes.find(n => n.id === id);
    currentNote = note;
    noteTitle.value = note.title;
    noteContent.value = note.content;
    updateCounts();
}

document.getElementById("newNoteBtn").onclick = () => {
    if (!currentFolder) return alert("Select folder first.");
    let data = getUserData();
    let newNote = {
        id: Date.now(),
        title: "Untitled",
        content: "",
        pinned: false
    };
    data.folders[currentFolder].push(newNote);
    saveUserData(data);
    loadNotes();
};

document.getElementById("deleteNoteBtn").onclick = () => {
    if (!currentNote) return;
    let data = getUserData();
    data.folders[currentFolder] =
        data.folders[currentFolder].filter(n => n.id !== currentNote.id);
    saveUserData(data);
    noteTitle.value = "";
    noteContent.value = "";
    loadNotes();
};

document.getElementById("downloadBtn").onclick = () => {
    if (!currentNote) return;
    const blob = new Blob([noteContent.value], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = (noteTitle.value || "note") + ".txt";
    link.click();
};

document.getElementById("clearBtn").onclick = () => {
    if (!currentNote) return;
    if (confirm("Clear content?")) {
        noteContent.value = "";
        saveNote();
    }
};

/* ---------- AUTO SAVE ---------- */

noteContent.addEventListener("input", () => {
    updateCounts();
    if (autoSaveEnabled) saveNote();
});

noteTitle.addEventListener("input", () => {
    if (autoSaveEnabled) saveNote();
});

function saveNote() {
    if (!currentNote) return;
    saveStatus.textContent = "Saving...";
    let data = getUserData();
    let notes = data.folders[currentFolder];
    let note = notes.find(n => n.id === currentNote.id);
    note.title = noteTitle.value;
    note.content = noteContent.value;
    saveUserData(data);
    saveStatus.textContent = "Saved";
}

function updateCounts() {
    let words = noteContent.value.trim().split(/\s+/).filter(Boolean);
    wordCount.textContent = words.length + " words";
    charCount.textContent = noteContent.value.length + " characters";
}

/* ---------- THEME ---------- */

document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("light");
};

/* ---------- SETTINGS ---------- */

const modal = document.getElementById("settingsModal");

document.getElementById("settingsBtn").onclick = () => {
    modal.classList.remove("hidden");
};

document.getElementById("closeSettings").onclick = () => {
    modal.classList.add("hidden");
};

document.getElementById("autoSaveToggle").onchange = (e) => {
    autoSaveEnabled = e.target.checked;
};

/* ---------- LOGOUT ---------- */

document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("session");
    location.reload();
};

/* ---------- SESSION RESTORE ---------- */

window.onload = () => {
    let session = localStorage.getItem("session");
    if (session) {
        currentUser = session;
        startApp();
    }
};
