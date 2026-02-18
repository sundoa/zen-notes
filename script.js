// --- STATE MANAGEMENT ---
let isSignUpMode = false;
let folders = JSON.parse(localStorage.getItem('zen_notes_v5')) || [
    { id: Date.now(), name: "Journal", notes: "" }
];
let currentFolderId = folders[0].id;

// --- AUTH LOGIC (Global Scope) ---
window.toggleAuthMode = function() {
    isSignUpMode = !isSignUpMode;
    const title = document.getElementById('auth-header');
    const btn = document.getElementById('auth-submit-btn');
    const link = document.getElementById('toggle-link');
    const hint = document.getElementById('toggle-text');

    if (isSignUpMode) {
        title.innerText = "Create Account";
        btn.innerText = "Register";
        hint.innerText = "Already a member?";
        link.innerText = "Sign In";
    } else {
        title.innerText = "Zen-Notes";
        btn.innerText = "Sign In";
        hint.innerText = "New here?";
        link.innerText = "Sign Up";
    }
};

window.handleAuth = function() {
    const user = document.getElementById('username-input').value.trim();
    const pass = document.getElementById('password-input').value.trim();
    
    if (!user || !pass) return alert("Fields cannot be empty.");

    if (isSignUpMode) {
        localStorage.setItem('zen_user', user);
        localStorage.setItem('zen_pass', pass);
        alert("Account Created Locally. Please Sign In.");
        window.toggleAuthMode();
    } else {
        if (user === localStorage.getItem('zen_user') && pass === localStorage.getItem('zen_pass')) {
            document.body.classList.remove('locked');
            initApp();
        } else {
            alert("Invalid credentials.");
        }
    }
};

window.lockVault = function() {
    document.body.classList.add('locked');
    document.getElementById('password-input').value = '';
};

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
            li.innerHTML = `
                <span onclick="loadFolder(${f.id})" style="flex:1">${f.name}</span>
                <span onclick="deleteFolder(${f.id})" style="opacity:0.4">×</span>
            `;
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
    const name = prompt("Folder Name:");
    if (name) {
        const newF = { id: Date.now(), name, notes: "" };
        folders.push(newF);
        save();
        window.loadFolder(newF.id);
    }
};

window.deleteFolder = function(id) {
    if (folders.length > 1 && confirm("Delete folder?")) {
        folders = folders.filter(f => f.id !== id);
        currentFolderId = folders[0].id;
        save();
        window.loadFolder(currentFolderId);
    }
};

window.filterFolders = function() {
    renderFolders(document.getElementById('search-bar').value);
};

window.toggleTheme = function() {
    document.body.classList.toggle('dark-theme');
};

// --- DATA PERSISTENCE ---
document.getElementById('note-area').addEventListener('input', (e) => {
    const f = folders.find(folder => folder.id === currentFolderId);
    if (f) {
        f.notes = e.target.value;
        save();
    }
});

function save() {
    localStorage.setItem('zen_notes_v5', JSON.stringify(folders));
}

function exportToPDF() {
    window.print();
}

// Support Enter key for login
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.body.classList.contains('locked')) window.handleAuth();
});
