// 1. SETTINGS
const AUTH = {
    user: "admin", 
    pass: "password123" 
};

// 2. DATA STORAGE
let folders = JSON.parse(localStorage.getItem('zen_notes_v2')) || [
    { id: Date.now(), name: "Main Folder", notes: "" }
];
let currentFolderId = folders[0].id;

// 3. AUTHENTICATION LOGIC
const loginBtn = document.getElementById('login-button');
const loginScreen = document.getElementById('login-screen');
const appContainer = document.getElementById('app-container');

function checkAuth() {
    const userVal = document.getElementById('username-input').value;
    const passVal = document.getElementById('password-input').value;
    const errorMsg = document.getElementById('error-msg');

    if (userVal === AUTH.user && passVal === AUTH.pass) {
        loginScreen.style.display = 'none';
        appContainer.style.display = 'flex';
        initApp(); // Start the app logic only after login
    } else {
        errorMsg.style.display = 'block';
        // Shake effect or feedback
        document.querySelector('.login-card').style.border = "1px solid red";
    }
}

// Trigger login on button click
loginBtn.addEventListener('click', checkAuth);

// Trigger login on 'Enter' key
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && loginScreen.style.display !== 'none') {
        checkAuth();
    }
});

// 4. APP LOGIC
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
            <span onclick="deleteFolder(${f.id})" class="del-icon">×</span>
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
document.getElementById('note-area').addEventListener('input', (e) => {
    const folder = folders.find(f => f.id === currentFolderId);
    if (folder) {
        folder.notes = e.target.value;
        saveData();
        document.getElementById('save-indicator').innerText = "Saving...";
        setTimeout(() => { document.getElementById('save-indicator').innerText = "Synced"; }, 1000);
    }
});

function saveData() {
    localStorage.setItem('zen_notes_v2', JSON.stringify(folders));
}

function exportToPDF() {
    window.print();
}
