// --- 1. STATE & DATA ---
let isSignUpMode = false;
let folders = JSON.parse(localStorage.getItem('zen_notes_v6')) || [
    { id: Date.now(), name: "Journal", notes: "" }
];
let currentFolderId = folders[0].id;

// --- 2. ENGINE INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Zen-Notes Engine Online");

    // Grab UI elements
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleBtn = document.getElementById('toggle-link');

    // Attach listeners
    if (submitBtn) submitBtn.addEventListener('click', handleAuth);
    if (toggleBtn) toggleBtn.addEventListener('click', toggleAuthMode);

    // Initial check for theme
    const savedTheme = localStorage.getItem('zen_theme');
    if (savedTheme === 'light') document.body.classList.remove('dark-theme');
});

// --- 3. AUTHENTICATION LOGIC ---
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    const title = document.getElementById('auth-header');
    const subtitle = document.getElementById('auth-subtitle');
    const btn = document.getElementById('auth-submit-btn');
    const link = document.getElementById('toggle-link');
    const hint = document.getElementById('toggle-text');

    if (isSignUpMode) {
        title.innerText = "Create Account";
        subtitle.innerText = "Join the minimalist workspace.";
        btn.innerText = "Register";
        hint.innerText = "Already a member?";
        link.innerText = "Sign In";
    } else {
        title.innerText = "Zen-Notes";
        subtitle.innerText = "Your thoughts, simplified.";
        btn.innerText = "Sign In";
        hint.innerText = "New here?";
        link.innerText = "Sign Up";
    }
}

function handleAuth() {
    const userIn = document.getElementById('username-input').value.trim();
    const passIn = document.getElementById('password-input').value.trim();
    
    if (!userIn || !passIn) {
        alert("Please enter both a username and password.");
        return;
    }

    if (isSignUpMode) {
        localStorage.setItem('zen_user', userIn);
        localStorage.setItem('zen_pass', passIn);
        alert("Success! Account registered. Now please Sign In.");
        toggleAuthMode();
    } else {
        const savedUser = localStorage.getItem('zen_user');
        const savedPass = localStorage.getItem('zen_pass');

        if (userIn === savedUser && passIn === savedPass) {
            document.body.classList.remove('locked');
            initApp();
        } else {
            alert("Incorrect credentials. (Did you Sign Up first?)");
        }
    }
}

// --- 4. APP FUNCTIONS ---
function initApp() {
    renderFolders();
    loadFolder(currentFolderId);
}

function renderFolders(filter = "") {
    const list = document.getElementById('folder-list');
    if (!list) return;
    list.innerHTML = '';

    folders.forEach(f => {
        if (f.name.toLowerCase().includes(filter.toLowerCase())) {
            const li = document.createElement('li');
            li.className = f.id === currentFolderId ? 'active' : '';
            li.innerHTML = `
                <span onclick="loadFolder(${f.id})" style="flex:1">${f.name}</span>
                <span onclick="deleteFolder(${f.id})" style="opacity:0.3; cursor:pointer">×</span>
            `;
            list.appendChild(li);
        }
    });
}

// Window scoped for the dynamic list above
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
    localStorage.setItem('zen_theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
};

window.lockVault = function() {
    document.body.classList.add('locked');
    document.getElementById('password-input').value = '';
};

function save() {
    localStorage.setItem('zen_notes_v6', JSON.stringify(folders));
}

function exportToPDF() {
    window.print();
}

// Auto-save typing
const noteArea = document.getElementById('note-area');
if (noteArea) {
    noteArea.addEventListener('input', (e) => {
        const f = folders.find(folder => folder.id === currentFolderId);
        if (f) {
            f.notes = e.target.value;
            save();
        }
    });
}
