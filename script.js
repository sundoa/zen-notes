// 1. CREDENTIALS
const USERNAME = "admin";
const PASSWORD = "password123";

// 2. DATA INITIALIZATION
let folders = JSON.parse(localStorage.getItem('zen_notes_v2')) || [
    { id: Date.now(), name: "First Folder", notes: "" }
];
let currentFolderId = folders[0].id;

// 3. AUTHENTICATION
function checkAuth() {
    const userIn = document.getElementById('username-input').value;
    const passIn = document.getElementById('password-input').value;
    const error = document.getElementById('error-msg');

    if (userIn === USERNAME && passIn === PASSWORD) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        initApp();
    } else {
        error.style.display = 'block';
    }
}

// 4. MAIN APP FUNCTIONS
function initApp() {
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
            <span onclick="deleteFolder(${f.id})" style="color:#666; cursor:pointer">×</span>
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
    const name = prompt("Folder name:");
    if (name) {
        const newFolder = { id: Date.now(), name: name, notes: "" };
        folders.push(newFolder);
        save();
        loadFolder(newFolder.id);
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

// 5. STORAGE & PDF
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

function exportToPDF() {
    window.print();
}
