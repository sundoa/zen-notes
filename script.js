// 1. Auth & Data
const PASSWORD = "yourpassword"; // Change this!
let folders = JSON.parse(localStorage.getItem('zen_notes_data')) || [
    { id: Date.now(), name: "First Folder", notes: "" }
];
let currentFolderId = folders[0].id;

// 2. Password Check
function checkPassword() {
    const input = document.getElementById('password-input').value;
    if (input === PASSWORD) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        init();
    } else {
        alert("Incorrect Password");
    }
}

// 3. App Logic
function init() {
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
            <span onclick="loadFolder(${f.id})" style="flex-grow:1">${f.name}</span>
            <button onclick="deleteFolder(${f.id})" style="background:none; color:red; border:none; cursor:pointer">×</button>
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

// 4. Save & Export
const noteArea = document.getElementById('note-area');
noteArea.addEventListener('input', () => {
    const folder = folders.find(f => f.id === currentFolderId);
    if (folder) {
        folder.notes = noteArea.value;
        save();
    }
});

function save() {
    localStorage.setItem('zen_notes_data', JSON.stringify(folders));
}

function exportToPDF() {
    // This triggers the browser's print dialog. 
    // On the popup, you MUST select "Save as PDF" as the destination.
    window.print();
}
