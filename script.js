// DOM elements
const notepad = document.getElementById('notepad');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const saveStatus = document.getElementById('saveStatus');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Constants
const STORAGE_KEY = 'notepad_content';
const AUTOSAVE_DELAY = 500; // milliseconds

let saveTimeout;

// Load saved content on page load
function loadContent() {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
        notepad.value = savedContent;
        updateStats();
    }
}

// Save content to localStorage
function saveContent() {
    clearTimeout(saveTimeout);
    
    saveStatus.textContent = 'Saving...';
    saveStatus.classList.add('saving');
    
    saveTimeout = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, notepad.value);
        saveStatus.textContent = 'Auto-saved';
        saveStatus.classList.remove('saving');
    }, AUTOSAVE_DELAY);
}

// Update character and word count
function updateStats() {
    const text = notepad.value;
    const chars = text.length;
    const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
    
    charCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
}

// Clear all content
function clearContent() {
    if (notepad.value.trim().length === 0) {
        return;
    }
    
    if (confirm('Are you sure you want to clear all text?')) {
        notepad.value = '';
        localStorage.removeItem(STORAGE_KEY);
        updateStats();
        saveStatus.textContent = 'Cleared';
        notepad.focus();
    }
}

// Download content as text file
function downloadContent() {
    const text = notepad.value;
    
    if (text.trim().length === 0) {
        alert('Nothing to download. Please write something first.');
        return;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const date = new Date();
    const filename = `notepad_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.txt`;
    
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Event listeners
notepad.addEventListener('input', () => {
    updateStats();
    saveContent();
});

clearBtn.addEventListener('click', clearContent);
downloadBtn.addEventListener('click', downloadContent);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save (already auto-saved, just show feedback)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveContent();
    }
    
    // Ctrl/Cmd + D to download
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        downloadContent();
    }
});

// Initialize
loadContent();
