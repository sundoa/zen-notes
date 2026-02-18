// Data Initialization
let folders = JSON.parse(localStorage.getItem('zen_notes_data')) || [
    { id: Date.now(), name: "General Notes", notes: "" }
];
let currentFolderId = folders[0].id;

const folderList = document.getElementById('folder-list');
const noteArea = document.getElementById('note-area');
const titleDisplay = document.getElementById('current-folder-title');
const saveStatus = document.getElementById('save-status');

function init() {
    renderFolders();
    loadFolder(currentFolderId);
}

function renderFolders() {
    folderList.innerHTML = '';
    folders.forEach(f => {
        const li = document.createElement('li');
        li.className = f.id === currentFolderId ? 'active' : '';
        li.innerHTML = `
            <span onclick="loadFolder(${f.id})" style="flex-grow:1">${f.name}</span>
            <button class="delete-btn" onclick="deleteFolder(${f.id})">×</button>
        `;
        folderList.appendChild(li);
    });
}

function loadFolder(id) {
    currentFolderId = id;
    const folder = folders.find(f => f.id === id);
    if (folder) {
        noteArea.value = folder.notes;
        titleDisplay.innerText = folder.name;
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
    if (folders.length === 1) return alert("You must keep at least one folder!");
    if (confirm("Delete this folder and all its notes?")) {
        folders = folders.filter(f => f.id !== id);
        if (currentFolderId === id) currentFolderId = folders[0].id;
        save();
        loadFolder(currentFolderId);
    }
}

// Auto-Save Feature
let saveTimeout;
noteArea.addEventListener('input', () => {
    saveStatus.innerText = "Typing...";
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const folder = folders.find(f => f.id === currentFolderId);
        if (folder) {
            folder.notes = noteArea.value;
            save();
            saveStatus.innerText = "All saved";
        }
    }, 800);
});

function save() {
    localStorage.setItem('zen_notes_data', JSON.stringify(folders));
}

function exportToPDF() {
    window.print(); // Browser handles the conversion to PDF
}

init();
