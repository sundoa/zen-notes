/**
 * ZEN-NOTES ENGINE v2.0
 */

// --- 1. GLOBAL STATE ---
let isSignUpMode = false;
let folders = JSON.parse(localStorage.getItem('zen_vault_v2')) || [
    { id: 1, name: "Journal", notes: "" }
];
let activeId = folders[0].id;

// --- 2. AUTHENTICATION (The Fix) ---
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    console.log("Auth Mode Switched. SignUp:", isSignUpMode);
    
    const title = document.getElementById('auth-title');
    const btn = document.getElementById('auth-main-btn');
    const hintBtn = document.getElementById('auth-toggle-link');
    const hintText = document.getElementById('toggle-hint');

    if (isSignUpMode) {
        title.innerText = "Initialize Vault";
        btn.innerText = "Create Account";
        hintText.innerText = "Already a member?";
        hintBtn.innerText = "Sign In";
    } else {
        title.innerText = "Zen-Notes Vault";
        btn.innerText = "Sign In";
        hintText.innerText = "First time here?";
        hintBtn.innerText = "Initialize New Account";
    }
}

function handleAuth() {
    const uInput = document.getElementById('username-field').value.trim();
    const pInput = document.getElementById('password-field').value.trim();

    if (!uInput || !pInput) {
        alert("Please enter credentials.");
        return;
    }

    if (isSignUpMode) {
        // REGISTER
        localStorage.setItem('zen_u', uInput);
        localStorage.setItem('zen_p', pInput);
        console.log("Account Created:", uInput);
        alert("Success! Account initialized. Now Sign In.");
        toggleAuthMode(); // Switch back to login
    } else {
        // LOGIN
        const savedU = localStorage.getItem('zen_u');
        const savedP = localStorage.getItem('zen_p');

        console.log("Attempting Login for:", uInput);

        if (uInput === savedU && pInput === savedP) {
            console.log("Access Granted.");
            document.body.classList.remove('locked');
            initApp();
        } else {
            console.error("Access Denied.");
            alert("Invalid Credentials. (Did you Initialize first?)");
        }
    }
}

// --- 3. APP LOGIC ---
function initApp() {
    renderFolders();
    loadNote(activeId);
}

function renderFolders(filter = "") {
    const list = document.getElementById('folder-list');
    list.innerHTML = '';
    
    folders.forEach(f => {
        if (f.name.toLowerCase().includes(filter.toLowerCase())) {
            const li = document.createElement('li');
            li.className = f.id === activeId ? 'active' : '';
            li.innerHTML = `
                <span onclick="loadNote(${f.id})" style="flex:1">${f.name}</span>
                <span onclick="deleteFolder(${f.id})" style="opacity:0.4; cursor:pointer">×</span>
            `;
            list.appendChild(li);
        }
    });
}

function loadNote(id) {
    activeId = id;
    const folder = folders.find(f => f.id === id);
    if (folder) {
        document.getElementById('active-folder-name').innerText = folder.name;
        document.getElementById('main-editor').value = folder.notes;
        renderFolders();
    }
}

function createNewFolder() {
    const name = prompt("Collection Name:");
    if (name) {
        const newF = { id: Date.now(), name: name.trim(), notes: "" };
        folders.push(newF);
        save();
        loadNote(newF.id);
    }
}

function deleteFolder(id) {
    if (folders.length > 1 && confirm("Discard this collection?")) {
        folders = folders.filter(f => f.id !== id);
        activeId = folders[0].id;
        save();
        loadNote(activeId);
    }
}

// --- 4. UTILITIES ---
function save() {
    localStorage.setItem('zen_vault_v2', JSON.stringify(folders));
}

function handleSearch() {
    const q = document.getElementById('folder-search').value;
    renderFolders(q);
}

function toggleInterfaceTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('zen_theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

function forceLock() {
    document.body.classList.add('locked');
    document.getElementById('password-field').value = '';
}

// Auto-Save Typing
document.getElementById('main-editor').addEventListener('input', (e) => {
    const folder = folders.find(f => f.id === activeId);
    if (folder) {
        folder.notes = e.target.value;
        save();
    }
});

// Run theme check on load
if (localStorage.getItem('zen_theme') === 'light') {
    document.body.classList.remove('dark-theme');
}
