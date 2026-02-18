// 1. Initial State & Data Loading
let folders = JSON.parse(localStorage.getItem('zen_notes_data')) || [
    { id: Date.now(), name: "My First Folder", notes: "" }
];
let currentFolderId = folders[0].id;

const noteArea = document.getElementById('note-area');
const folderList = document.getElementById('folder-list');
const saveStatus = document.getElementById('save-status');

// 2. Core Functions
function init() {
    renderFolders();
    loadFolder(currentFolderId);
}

function renderFolders() {
    folderList.innerHTML = '';
    folders.forEach(folder => {
        const li = document.createElement('li');
        li.className = folder.id === currentFolderId ? 'active' : '';
        li.innerHTML = `
            <span onclick="loadFolder(${folder.id})">${folder.name}</span>
            <button onclick="deleteFolder(${folder.id})">×</button>
        `;
        folderList.appendChild(li);
    });
}

function loadFolder(id) {
    currentFolderId = id;
    const folder = folders.find(f => f.id === id);
    if (folder) {
        noteArea.value = folder.notes;
        noteArea.disabled = false;
        document.getElementById('current-folder-name').innerText = folder.name;
        renderFolders();
    }
}

function addFolder() {
    const name = prompt("Folder name:");
    if (name) {
        const newFolder = { id: Date.now(), name: name, notes: "" };
        folders.push(newFolder);
        saveToLocalStorage();
        renderFolders();
        loadFolder(newFolder.id);
    }
}

function deleteFolder(id) {
    if (folders.length === 1) return alert("You need at least one folder!");
    if (confirm("Delete this folder and all its notes?")) {
        folders = folders.filter(f => f.id !== id);
        if (currentFolderId === id) currentFolderId = folders[0].id;
        saveToLocalStorage();
        renderFolders();
        loadFolder(currentFolderId);
    }
}

// 3. The "Save" Logic
let saveTimeout;
noteArea.addEventListener('input', () => {
    saveStatus.innerText = "Typing...";
    
    // Clear the previous timeout
    clearTimeout(saveTimeout);
    
    // Wait 1 second after typing stops to save
    saveTimeout = setTimeout(() => {
        const folder = folders.find(f => f.id === currentFolderId);
        if (folder) {
            folder.notes = noteArea.value;
            saveToLocalStorage();
            saveStatus.innerText = "Saved";
        }
    }, 1000);
});

function saveToLocalStorage() {
    localStorage.setItem('zen_notes_data', JSON.stringify(folders));
}

// 4. Run on Startup
init();
