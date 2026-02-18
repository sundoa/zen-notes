let isSignUpMode = false;
let folders = JSON.parse(localStorage.getItem('zen_notes_v4')) || [
    { id: Date.now(), name: "Journal", notes: "" }
];
let currentFolderId = folders[0].id;

// --- AUTH LOGIC ---
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('auth-title').innerText = isSignUpMode ? "Create Account" : "Zen-Notes";
    document.getElementById('auth-submit-btn').innerText = isSignUpMode ? "Register" : "Sign In";
    document.getElementById('toggle-link').innerText = isSignUpMode ? "Sign In" : "Create Account";
}

function handleAuth() {
    const user = document.getElementById('username-input').value.trim();
    const pass = document.getElementById('password-input').value.trim();
    
    if (isSignUpMode) {
        localStorage.setItem('zen_user', user);
        localStorage.setItem('zen_pass', pass);
        alert("Account ready."); toggleAuthMode();
    } else {
        if (user === localStorage.getItem('zen_user') && pass === localStorage.getItem('zen_pass')) {
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app-container').style.display = 'flex';
            initApp();
        } else {
            alert("Wrong credentials");
        }
    }
}

// --- FOLDER & SEARCH LOGIC ---
function initApp() { renderFolders(); loadFolder(currentFolderId); }

function renderFolders(filter = "") {
    const list = document.getElementById('folder-list');
    list.innerHTML = '';
    folders.forEach(f => {
        if (f.name.toLowerCase().includes(filter.toLowerCase())) {
            const li = document.createElement('li');
            li.className = f.id === currentFolderId ? 'active' : '';
            li.innerHTML = `<span onclick="loadFolder(${f.id})">${f.name}</span>
                            <span onclick="deleteFolder(${f.id})" style="opacity:0.5">×</span>`;
            list.appendChild(li);
        }
    });
}

function filterFolders() {
    const query = document.getElementById('search-bar').value;
    renderFolders(query);
}

function loadFolder(id) {
    currentFolderId = id;
    const f = folders.find(folder => folder.id === id);
    if (f) {
        document.getElementById('note-area').value = f.notes;
        document.getElementById('current-folder-title').innerText = f.name;
        renderFolders(document.getElementById('search-bar').value);
    }
}

function addFolder() {
    const name = prompt("Folder Name:");
    if (name) {
        const newF = { id: Date.now(), name, notes: "" };
        folders.push(newF); save(); loadFolder(newF.id);
    }
}

function deleteFolder(id) {
    if (folders.length > 1 && confirm("Delete?")) {
        folders = folders.filter(f => f.id !== id);
        currentFolderId = folders[0].id;
        save(); loadFolder(currentFolderId);
    }
}

// --- UTILS ---
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

document.getElementById('note-area').addEventListener('input', (e) => {
    const f = folders.find(folder => folder.id === currentFolderId);
    if (f) { f.notes = e.target.value; save(); }
});

function save() { localStorage.setItem('zen_notes_v4', JSON.stringify(folders)); }
function exportToPDF() { window.print(); }
