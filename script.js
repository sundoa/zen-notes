// 1. YOUR CREDENTIALS
const AUTH_USER = "admin";
const AUTH_PASS = "password123";

// 2. DATA SETUP
let folders = JSON.parse(localStorage.getItem('zen_notes_v2')) || [
    { id: Date.now(), name: "Main Folder", notes: "" }
];
let currentFolderId = folders[0].id;

// 3. THE LOGIN FUNCTION (Simplified)
function checkAuth() {
    console.log("Login button clicked..."); // Check your F12 console for this!
    
    const userVal = document.getElementById('username-input').value;
    const passVal = document.getElementById('password-input').value;
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    const errorMsg = document.getElementById('error-msg');

    if (userVal === AUTH_USER && passVal === AUTH_PASS) {
        console.log("Access Granted");
        loginScreen.style.setProperty('display', 'none', 'important');
        appContainer.style.setProperty('display', 'flex', 'important');
        initApp();
    } else {
        console.log("Access Denied");
        errorMsg.style.display = 'block';
    }
}

// 4. APP LOGIC
function initApp() {
    renderFolders();
    loadFolder(currentFolderId);
}

function renderFolders() {
    const list = document.getElementById('folder-list');
    if(!list) return;
    list.innerHTML = '';
    folders.forEach(f => {
        const li = document.createElement('li');
        li.className = f.id === currentFolderId ? 'active' : '';
        li.innerHTML = `
            <span onclick="loadFolder(${f.id})" style="flex:1">${f.name}</span>
            <span onclick="deleteFolder(${f.id})" style="cursor:pointer; padding:0 10px;">×</span>
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
    const name = prompt("Folder Name:");
    if (name) {
        const newF = { id: Date.now(), name: name, notes: "" };
        folders.push(newF);
        saveData();
        loadFolder(newF.id);
    }
}

function deleteFolder(id) {
    if (folders.length === 1) return;
    if (confirm("Delete this folder?")) {
        folders = folders.filter(f => f.id !== id);
        if (currentFolderId === id) currentFolderId = folders[0].id;
        saveData();
        loadFolder(currentFolderId);
    }
}

// 5. AUTO-SAVE & PDF
const noteArea = document.getElementById('note-area');
if(noteArea) {
    noteArea.addEventListener('input', (e) => {
        const folder = folders.find(f => f.id === currentFolderId);
        if (folder) {
            folder.notes = e.target.value;
            saveData();
        }
    });
}

function saveData() {
    localStorage.setItem('zen_notes_v2', JSON.stringify(folders));
}

function exportToPDF() {
    window.print();
}
