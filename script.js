let currentUser = null;
let isSignUp = false;
let currentFolder = null;
let currentNoteId = null;

const authScreen = document.getElementById("authScreen");
const appContainer = document.getElementById("appContainer");

const authBtn = document.getElementById("authBtn");
const toggleAuth = document.getElementById("toggleAuth");
const authTitle = document.getElementById("authTitle");
const authMessage = document.getElementById("authMessage");

const folderList = document.getElementById("folderList");
const newFolderBtn = document.getElementById("newFolderBtn");
const searchInput = document.getElementById("searchInput");

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");

const newNoteBtn = document.getElementById("newNoteBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");
const logoutBtn = document.getElementById("logoutBtn");

/* ---------- AUTH ---------- */

toggleAuth.addEventListener("click", () => {
    isSignUp = !isSignUp;
    authTitle.textContent = isSignUp ? "Sign Up" : "Sign In";
    authBtn.textContent = isSignUp ? "Create Account" : "Sign In";
    toggleAuth.textContent = isSignUp
        ? "Already have an account? Sign In"
        : "Don't have an account? Sign Up";
});

authBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        authMessage.textContent = "Fill all fields.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (isSignUp) {
        if (users[username]) {
            authMessage.textContent = "User already exists.";
            return;
        }
        users[username] = { password, folders: {} };
        localStorage.setItem("users", JSON.stringify(users));
        authMessage.textContent = "Account created!";
    } else {
        if (!users[username] || users[username].password !== password) {
            authMessage.textContent = "Invalid credentials.";
            return;
        }
        currentUser = username;
        startApp();
    }
});

/* ---------- APP ---------- */

function startApp() {
    authScreen.classList.add("hidden");
    appContainer.classList.remove("hidden");
    loadFolders();
}

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

newFolderBtn.addEventListener("click", () => {
    const name = prompt("Folder name:");
    if (!name) return;

    let data = getUserData();
    data.folders[name] = [];
    saveUserData(data);
    loadFolders();
});

function loadFolders() {
    folderList.innerHTML = "";
    let data = getUserData();

    Object.keys(data.folders).forEach(folder => {
        const li = document.createElement("li");
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
    noteTitle.value = "";
    noteContent.value = "";
}

newNoteBtn.addEventListener("click", () => {
    if (!currentFolder) return alert("Select folder first.");
    currentNoteId = Date.now();
    saveNote();
});

noteContent.addEventListener("input", saveNote);
noteTitle.addEventListener("input", saveNote);

function saveNote() {
    if (!currentFolder) return;

    let data = getUserData();
    let folder = data.folders[currentFolder];

    let existing = folder.find(n => n.id === currentNoteId);

    if (existing) {
        existing.title = noteTitle.value;
        existing.content = noteContent.value;
    } else {
        folder.push({
            id: currentNoteId,
            title: noteTitle.value,
            content: noteContent.value
        });
    }

    saveUserData(data);
}

/* ---------- SEARCH ---------- */

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    let data = getUserData();
    folderList.innerHTML = "";

    Object.keys(data.folders).forEach(folder => {
        let notes = data.folders[folder];
        let match = notes.some(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        );

        if (match || folder.toLowerCase().includes(query)) {
            const li = document.createElement("li");
            li.textContent = folder;
            li.onclick = () => {
                currentFolder = folder;
                loadNotes();
            };
            folderList.appendChild(li);
        }
    });
});

/* ---------- DOWNLOAD ---------- */

downloadBtn.addEventListener("click", () => {
    const blob = new Blob([noteContent.value], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = (noteTitle.value || "note") + ".txt";
    link.click();
    URL.revokeObjectURL(link.href);
});

/* ---------- CLEAR ---------- */

clearBtn.addEventListener("click", () => {
    if (confirm("Clear this note?")) {
        noteContent.value = "";
        saveNote();
    }
});

/* ---------- LOGOUT ---------- */

logoutBtn.addEventListener("click", () => {
    currentUser = null;
    appContainer.classList.add("hidden");
    authScreen.classList.remove("hidden");
});
