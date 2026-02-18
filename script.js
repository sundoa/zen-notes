// --- STATE ---
let isSignUpMode = false;
let folders = JSON.parse(localStorage.getItem('zen_notes_v6')) || [
    { id: Date.now(), name: "Journal", notes: "" }
];
let currentFolderId = folders[0].id;

// --- INIT ON LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleBtn = document.getElementById('toggle-link');

    if (submitBtn) submitBtn.addEventListener('click', handleAuth);
    if (toggleBtn) toggleBtn.addEventListener('click', toggleAuthMode);

    // Apply saved theme
    if (localStorage.getItem('zen_theme') === 'light') {
        document.body.classList.remove('dark-theme');
    }
});

// --- AUTH ---
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    document.getElementById('auth-header').innerText = isSignUpMode ? "Create Account" : "Zen-Notes";
    document.getElementById('auth-submit-btn').innerText = isSignUpMode ? "Register" : "Sign In";
    document.getElementById('toggle-link').innerText = isSignUpMode ? "Sign In" : "Sign Up";
    document.getElementById('toggle-text').innerText = isSignUpMode ? "Already a member?" : "New here?";
}

function handleAuth() {
    const user = document.getElementById('username-input').value.trim();
    const pass = document.getElementById('password-input').value.trim();
    
    if (!user || !pass) return alert("Missing fields");

    if (isSignUpMode) {
        localStorage.setItem('zen_user', user);
        localStorage.setItem('zen_pass', pass);
        alert("Account Registered. Please Sign In.");
        toggleAuthMode();
    } else {
        if (user === localStorage.getItem('zen_user') && pass === localStorage.getItem('zen_pass')) {
            document.body.classList.remove('locked');
            initApp();
        } else {
            alert("Wrong credentials.");
        }
    }
}

// --- APP CORE ---
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
            li.innerHTML = `<span onclick="loadFolder(${f.id})" style="flex:1">${f.name}</span>
                            <span onclick="deleteFolder(${f.id})" style="opacity:0.3;cursor:pointer">×</span>`;
            list.appendChild(li);
        }
    });
}

window.loadFolder = function(id) {
    currentFolderId = id;
    const f = folders.find(folder => folder.id === id);
    if (f) {
        document.getElementById('note-area').value = f.notes;
        document.getElementById('current-folder-title').innerText = f.name;
        renderFolders(document.getElementById('search-bar').value);
    }
};

window.addFolder = function() {
    const name = prompt("Name:");
    if (name) {
        const newF = { id: Date.now(), name, notes: "" };
        folders.push(newF);
        save();
        window.loadFolder(newF.id);
    }
};

window.deleteFolder = function(id) {
    if (folders.length > 1 && confirm("Delete?")) {
        folders = folders.filter(f => f.id !== id);
        currentFolderId = folders[0].id;
        save();
        window.loadFolder(currentFolderId);
    }
};

function save() { localStorage.setItem('zen_notes_v6', JSON.stringify(folders)); }

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('zen_theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

function lockVault() {
    document.body.classList.add('locked');
    document.getElementById('password-input').value = '';
}

function exportToPDF() { window.print(); }

document.getElementById('note-area').addEventListener('input', (e) => {
    const f = folders.find(folder => folder.id === currentFolderId);
    if (f) { f.notes = e.target.value; save(); }
});
