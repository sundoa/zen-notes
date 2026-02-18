/**
 * ZEN-NOTES ENGINE v1.0
 * Pure JavaScript - No Dependencies
 */

(function() {
    // 1. APP STATE
    const State = {
        isSignUpMode: false,
        folders: [],
        activeId: null,
        user: null,
        pass: null,
        theme: 'dark'
    };

    // 2. SELECTORS
    const UI = {
        body: document.body,
        authTitle: document.getElementById('auth-title'),
        authBtn: document.getElementById('auth-main-btn'),
        authToggle: document.getElementById('auth-toggle-link'),
        folderList: document.getElementById('folder-list'),
        editor: document.getElementById('main-editor'),
        activeTitle: document.getElementById('active-folder-name'),
        wordCount: document.getElementById('word-count'),
        charCount: document.getElementById('char-count'),
        syncStatus: document.getElementById('sync-status')
    };

    // 3. INITIALIZATION
    function init() {
        loadLocalStorage();
        setupEventListeners();
        applyTheme();
        
        if (State.user) {
            console.log("Vault Ready. Awaiting Authentication.");
        } else {
            console.log("First Run Detected.");
        }
    }

    function loadLocalStorage() {
        const data = localStorage.getItem('zen_vault_data');
        if (data) {
            State.folders = JSON.parse(data);
        } else {
            State.folders = [{ id: Date.now(), name: "First Collection", notes: "Welcome to Zen-Notes." }];
        }
        
        State.user = localStorage.getItem('zen_u');
        State.pass = localStorage.getItem('zen_p');
        State.theme = localStorage.getItem('zen_theme') || 'dark';
        State.activeId = State.folders[0].id;
    }

    // 4. AUTHENTICATION LOGIC
    function setupEventListeners() {
        // Auth Toggling
        UI.authToggle.onclick = () => {
            State.isSignUpMode = !State.isSignUpMode;
            UI.authTitle.innerText = State.isSignUpMode ? "Create Access Key" : "Zen-Notes Vault";
            UI.authBtn.innerText = State.isSignUpMode ? "Initialize" : "Sign In";
            UI.authToggle.innerText = State.isSignUpMode ? "Back to Sign In" : "Initialize New Account";
        };

        // Auth Submission
        UI.authBtn.onclick = handleAuthentication;

        // Auto-Save Editor
        UI.editor.oninput = (e) => {
            const folder = State.folders.find(f => f.id === State.activeId);
            if (folder) {
                folder.notes = e.target.value;
                updateStats();
                autoSave();
            }
        };
    }

    function handleAuthentication() {
        const u = document.getElementById('username-field').value.trim();
        const p = document.getElementById('password-field').value.trim();

        if (!u || !p) return alert("Credentials required.");

        if (State.isSignUpMode) {
            localStorage.setItem('zen_u', u);
            localStorage.setItem('zen_p', p);
            alert("Vault Initialized. You may now sign in.");
            location.reload(); 
        } else {
            if (u === State.user && p === State.pass) {
                UI.body.classList.remove('locked');
                startApp();
            } else {
                alert("Decryption Failed: Invalid credentials.");
            }
        }
    }

    // 5. WORKSPACE LOGIC
    function startApp() {
        renderFolders();
        loadNote(State.activeId);
    }

    window.renderFolders = function(filter = "") {
        UI.folderList.innerHTML = '';
        State.folders.forEach(folder => {
            if (folder.name.toLowerCase().includes(filter.toLowerCase())) {
                const li = document.createElement('li');
                li.className = folder.id === State.activeId ? 'active' : '';
                li.innerHTML = `
                    <span class="f-name" onclick="loadNote(${folder.id})">${folder.name}</span>
                    <span class="f-del" onclick="deleteFolder(${folder.id})">×</span>
                `;
                UI.folderList.appendChild(li);
            }
        });
    }

    window.loadNote = function(id) {
        State.activeId = id;
        const folder = State.folders.find(f => f.id === id);
        if (folder) {
            UI.activeTitle.innerText = folder.name;
            UI.editor.value = folder.notes;
            updateStats();
            renderFolders();
        }
    }

    window.createNewFolder = function() {
        const name = prompt("Collection Title:");
        if (name && name.trim() !== "") {
            const newObj = { id: Date.now(), name: name.trim(), notes: "" };
            State.folders.push(newObj);
            saveToStorage();
            loadNote(newObj.id);
        }
    }

    window.deleteFolder = function(id) {
        if (State.folders.length <= 1) return alert("At least one collection is required.");
        if (confirm("Permanently discard this collection?")) {
            State.folders = State.folders.filter(f => f.id !== id);
            State.activeId = State.folders[0].id;
            saveToStorage();
            loadNote(State.activeId);
        }
    }

    // 6. UTILITIES
    function updateStats() {
        const text = UI.editor.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        const chars = text.length;
        UI.wordCount.innerText = words;
        UI.charCount.innerText = `${chars} characters`;
    }

    function autoSave() {
        UI.syncStatus.innerText = "● Saving...";
        UI.syncStatus.style.color = "var(--accent)";
        
        clearTimeout(window.saveTimer);
        window.saveTimer = setTimeout(() => {
            saveToStorage();
            UI.syncStatus.innerText = "● System Synced";
            UI.syncStatus.style.color = "var(--text-muted)";
            document.getElementById('last-saved').innerText = `Last saved: ${new Date().toLocaleTimeString()}`;
        }, 1000);
    }

    function saveToStorage() {
        localStorage.setItem('zen_vault_data', JSON.stringify(State.folders));
    }

    window.handleSearch = function() {
        const query = document.getElementById('folder-search').value;
        renderFolders(query);
    }

    window.toggleInterfaceTheme = function() {
        UI.body.classList.toggle('dark-theme');
        const current = UI.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('zen_theme', current);
    }

    function applyTheme() {
        if (State.theme === 'light') UI.body.classList.remove('dark-theme');
        else UI.body.classList.add('dark-theme');
    }

    window.forceLock = function() {
        UI.body.classList.add('locked');
        document.getElementById('password-field').value = '';
    }

    window.generatePDF = function() {
        window.print();
    }

    window.clearCurrentNote = function() {
        if (confirm("Clear all text in this note?")) {
            UI.editor.value = '';
            UI.editor.dispatchEvent(new Event('input'));
        }
    }

    // Run Engine
    init();

})();
