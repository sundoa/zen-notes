// 1. GLOBAL STATE
let isSignUpMode = false;
let folders = JSON.parse(localStorage.getItem('zen_notes_v3')) || [
    { id: Date.now(), name: "General Notes", notes: "" }
];
let currentFolderId = folders[0].id;

// 2. AUTHENTICATION LOGIC
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    const title = document.getElementById('auth-title');
    const desc = document.getElementById('auth-desc');
    const btn = document.getElementById('auth-submit-btn');
    const toggleHint = document.getElementById('toggle-text');
    const toggleLink = document.getElementById('toggle-link');

    if (isSignUpMode) {
        title.innerText = "Create Account";
        desc.innerText = "Set your local login details";
        btn.innerText = "Sign Up";
        toggleHint.innerText = "Already have an account?";
        toggleLink.innerText = "Sign In";
    } else {
        title.innerText = "Welcome Back";
        desc.innerText = "Please sign in to access your notes";
        btn.innerText = "Sign In";
        toggleHint.innerText = "Don't have an account?";
        toggleLink.innerText = "Sign Up";
    }
}

function handleAuth() {
    const userIn = document.getElementById('username-input').value.trim();
    const passIn = document.getElementById('password-input').value.trim();
    const errorMsg = document.getElementById('error-msg');

    if (!userIn || !passIn) {
        showError("Username and Password are required");
        return;
    }

    if (isSignUpMode) {
        // Registration
        localStorage.setItem('zen_vault_user', userIn);
        localStorage.setItem('zen_vault_pass', passIn);
        alert("Account Created Locally! Please Sign In.");
        toggleAuthMode();
    } else {
        // Login Check
        const savedUser = localStorage.getItem('zen_vault_user');
        const savedPass = localStorage.getItem('zen_vault_pass');

        if (userIn === savedUser && passIn === savedPass) {
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app-container').style.display = 'flex';
            initApp();
        } else {
            showError("Invalid credentials. Try again.");
        }
    }
}

function showError(text) {
    const error = document.getElementById('error-msg');
    error.innerText = text;
    error.style.display = 'block';
}

// 3. APP INITIALIZATION
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
            <span onclick="deleteFolder(${f.id})" style="opacity:0.5; cursor:pointer">×</span>
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

// 4. STORAGE & EXPORT
document.getElementById('note-area').addEventListener('input', (e) => {
    const folder = folders.find(f => f.id === currentFolderId);
    if (folder) {
        folder.notes = e.target.value;
        save();
    }
});

function save() {
    localStorage.setItem('zen_notes_v3', JSON.stringify(folders));
}

function exportToPDF() {
    window.print();
}
