// 1. AUTH STATE
let isSignUpMode = false;

// 2. DATA INITIALIZATION
let folders = JSON.parse(localStorage.getItem('zen_notes_v2')) || [
    { id: Date.now(), name: "First Folder", notes: "" }
];
let currentFolderId = folders[0].id;

// 3. AUTHENTICATION LOGIC
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    const title = document.getElementById('auth-title');
    const desc = document.getElementById('auth-desc');
    const btn = document.getElementById('auth-submit');
    const toggleText = document.getElementById('auth-toggle-text');

    if (isSignUpMode) {
        title.innerText = "Create Account";
        desc.innerText = "Set your username and password";
        btn.innerText = "Sign Up";
        toggleText.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode()" style="color: #007aff;">Sign In</a>';
    } else {
        title.innerText = "Welcome Back";
        desc.innerText = "Please sign in to continue";
        btn.innerText = "Sign In";
        toggleText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()" style="color: #007aff;">Sign Up</a>';
    }
}

function handleAuth() {
    const userIn = document.getElementById('username-input').value;
    const passIn = document.getElementById('password-input').value;
    const error = document.getElementById('error-msg');
    
    // Get stored credentials
    const storedUser = localStorage.getItem('zen_user');
    const storedPass = localStorage.getItem('zen_pass');

    if (isSignUpMode) {
        // SIGN UP
        if (userIn.length < 3 || passIn.length < 4) {
            error.innerText = "Username/Password too short!";
            error.style.display = 'block';
            return;
        }
        localStorage.setItem('zen_user', userIn);
        localStorage.setItem('zen_pass', passIn);
        alert("Account Created! Now Sign In.");
        toggleAuthMode();
    } else {
        // SIGN IN
        if (userIn === storedUser && passIn === storedPass) {
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app-container').style.display = 'flex';
            initApp();
        } else {
            error.innerText = "Invalid Username or Password";
            error.style.display = 'block';
        }
    }
}

// 4. MAIN APP LOGIC (Folder management same as before)
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
        li.innerHTML = `<span onclick="loadFolder(${f.id})" style="flex:1">${f.name}</span>
                        <span onclick="deleteFolder(${f.id})" style="color:#666; cursor:pointer">×</span>`;
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

// 5. SAVE, EXPORT, LOGOUT
document.getElementById('note-area').addEventListener('input', (e) => {
    const folder = folders.find(f => f.id === currentFolderId);
    if (folder) {
        folder.notes = e.target.value;
        save();
    }
});

function save() { localStorage.setItem('zen_notes_v2', JSON.stringify(folders)); }
function exportToPDF() { window.print(); }
function logout() { location.reload(); }
