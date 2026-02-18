// CONFIGURATION
const USER_DATA = {
    username: "admin",
    password: "password123"
};

// DATA HANDLING
let folders = JSON.parse(localStorage.getItem('zen_notes_v2')) || [
    { id: Date.now(), name: "Unsorted Notes", notes: "" }
];
let currentFolderId = folders[0].id;

// AUTHENTICATION LOGIC
function checkAuth() {
    const userIn = document.getElementById('username-input').value;
    const passIn = document.getElementById('password-input').value;
    const error = document.getElementById('error-msg');

    if (userIn === USER_DATA.username && passIn === USER_DATA.password) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        init();
    } else {
        error.style.display = 'block';
    }
}

// FOLDER & NOTE LOGIC
function init() {
    renderFolders();
    loadFolder(currentFolderId);
}

function renderFolders() {
    const list = document.getElementById('folder-list');
    list.innerHTML = '';
    folders.forEach(f => {
        const li = document.createElement('li');
        li.className = f.id === currentFolderId ? 'active' : '';
        li.innerHTML = `
            <span onclick="loadFolder(${f.id})" style="flex:1">${f.name}</span>
            <span onclick="deleteFolder(${f.id})" style="color:#666; font-size:1.2rem">×</span>
        `;
        list.appendChild(li);
    });
}

function loadFolder(id) {
    currentFolderId = id;
    const folder = folders.find(f => f.id === id);
    if (folder) {
        document.getElementById('note-area').value = folder.notes;
        document.getElementById('current-folder-title').innerText = folder.name;
        renderFolders();
    }
}

function addFolder() {
    const name = prompt("New Folder Name:");
    if (name) {
        const newF = { id: Date.now(), name: name, notes: "" };
        folders.push(newF);
        save();
        loadFolder(newF.id);
    }
}

function deleteFolder(id) {
    if (folders.length === 1) return;
    if (confirm("Delete this folder?")) {
        folders = folders.filter(f => f.id !== id);
        if (currentFolderId === id) currentFolderId = folders[0].id;
        save();
        loadFolder(currentFolderId);
    }
}

// AUTO-SAVE
document.getElementById('note-area').addEventListener('input', (e) => {
    const folder = folders.find(f => f.id === currentFolderId);
    if (folder) {
        folder.notes = e.target.value;
        save();
    }
});

function save() {
    localStorage.setItem('zen_notes_v2', JSON.stringify(folders));
}

// PDF EXPORT
function exportToPDF() {
    // This will open the system print dialog.
    // User must select 'Save as PDF' in the printer settings.
    window.print();
}
