/**
 * ZEN-NOTES MASTER SCRIPT
 * Handles: Auth, Folder Management, Search, Auto-save, and Theme
 */

// 1. STATE & DATA INITIALIZATION
let isSignUpMode = false;

// Load folders from LocalStorage or create a default one
let folders = JSON.parse(localStorage.getItem('zen_notes_v5')) || [
    { id: Date.now(), name: "My Journal", notes: "" }
];
let currentFolderId = folders[0].id;

// 2. AUTHENTICATION & VAULT LOGIC
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    const title = document.querySelector('#login-screen h1');
    const btn = document.getElementById('auth-submit-btn');
    const toggleLink = document.querySelector('.text-link');
    const hint = document.getElementById('toggle-text');

    if (isSignUpMode) {
        title.innerText = "Create Account";
        btn.innerText = "Register";
        hint.innerText = "Already a member?";
        toggleLink.innerText = "Sign In";
    } else {
        title.innerText = "Zen-Notes";
        btn.innerText = "Sign In";
        hint.innerText = "New here?";
        toggleLink.innerText = "Sign Up";
    }
}

function handleAuth() {
    const userIn = document.getElementById('username-input').value.trim();
    const passIn = document.getElementById('password-input').value.trim();
    
    if (!userIn || !passIn) {
        alert("Please fill in all fields.");
        return;
    }

    if (isSignUpMode) {
        localStorage.setItem('zen_user', userIn);
        localStorage.setItem('zen_pass', passIn);
        alert("Account created locally! You can now sign in.");
        toggleAuthMode();
    } else {
        const savedUser = localStorage.getItem('zen_user');
        const savedPass = localStorage.getItem('zen_pass');

        if (userIn === savedUser && passIn === savedPass) {
            document.body.classList.remove('locked'); // Unlocks the UI
            initApp();
        } else {
            alert("Access Denied: Invalid credentials.");
        }
    }
}

function lockVault() {
    document.body.classList.add('locked');
    // Clear inputs for security when locking
    document.getElementById('username-input').value = '';
    document.getElementById('password-input').value = '';
}

// 3. FOLDER MANAGEMENT
function initApp() {
    renderFolders();
    loadFolder(currentFolderId);
}

function renderFolders(filter = "") {
    const list = document.getElementById('folder-list');
    list.innerHTML = '';

    folders.forEach(f => {
        if (f.name.toLowerCase().includes(filter.toLowerCase())) {
            const li = document.createElement('li');
            li.className = f.id === currentFolderId ? 'active' : '';
            li.innerHTML = `
                <span onclick="loadFolder(${f.id})" style="flex:1">${f.name}</span>
                <span onclick="deleteFolder(${f.id})" style="cursor:pointer; opacity:0.4">×</span>
            `;
            list.appendChild(li);
        }
    });
}

function loadFolder(id) {
    currentFolderId = id;
    const folder = folders.find(f => f.id === id);
    if (folder) {
        document.getElementById('note-area').value = folder.notes;
        document.getElementById('current-folder-title').innerText = folder.name;
        renderFolders(document.getElementById('search-bar').value);
    }
}

function addFolder() {
    const name = prompt("Enter folder name:");
    if (name && name.trim() !== "") {
        const newFolder = { id: Date.now(), name: name.trim(), notes: "" };
        folders.push(newFolder);
        saveData();
        loadFolder(newFolder.id);
    }
}

function deleteFolder(id) {
    if (folders.length === 1) {
        alert("You must keep at least one folder.");
        return;
    }
    if (confirm("Permanently delete this folder?")) {
        folders = folders.filter(f => f.id !== id);
        if (currentFolderId === id) currentFolderId = folders[0].id;
        saveData();
        loadFolder(currentFolderId);
    }
}

function filterFolders() {
    const query = document.getElementById('search-bar').value;
    renderFolders(query);
}

// 4. THEME & UTILITIES
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    // Optional: Save theme preference
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('zen_theme', isDark ? 'dark' : 'light');
}

// Check for saved theme on load
if (localStorage.getItem('zen_theme') === 'light') {
    document.body.classList.remove('dark-theme');
}

function exportToPDF() {
    window
