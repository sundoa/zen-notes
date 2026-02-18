let currentUser = null;
let activeFolder = null;

// --- THEME ---
const themeBtn = document.getElementById('theme-toggle');
document.body.setAttribute('data-theme', localStorage.getItem('zen-theme') || 'light');

themeBtn.addEventListener('click', () => {
  const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('zen-theme', newTheme);
});

// --- AUTH (STORES PER USER) ---
function handleAuth() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value; // In a real app, you'd verify this
  
  if (!user || !pass) return alert("Enter both fields");
  
  currentUser = user;
  document.getElementById('auth-overlay').style.display = 'none';
  loadFolders();
}

function logout() {
  currentUser = null;
  activeFolder = null;
  document.getElementById('note-area').value = "";
  document.getElementById('note-area').disabled = true;
  document.getElementById('current-folder-name').innerText = "Select a folder";
  document.getElementById('auth-overlay').style.display = 'flex';
}

// --- FOLDERS & DATA ---
function getuserData() {
  // This fetches only the data belonging to the logged-in user
  const allData = JSON.parse(localStorage.getItem('zen_notes_data')) || {};
  return allData[currentUser] || {};
}

function saveUserData(folders) {
  const allData = JSON.parse(localStorage.getItem('zen_notes_data')) || {};
  allData[currentUser] = folders;
  localStorage.setItem('zen_notes_data', JSON.stringify(allData));
}

function addFolder() {
  const name = prompt("Folder name:");
  if (!name) return;
  
  let folders = getuserData();
  if (!folders[name]) {
    folders[name] = "";
    saveUserData(folders);
    loadFolders();
  }
}

function loadFolders() {
  const list = document.getElementById('folder-list');
  list.innerHTML = "";
  let folders = getuserData();
  
  Object.keys(folders).forEach(name => {
    let li = document.createElement('li');
    li.innerText = "📁 " + name;
    if(activeFolder === name) li.classList.add('active');
    li.onclick = () => openFolder(name);
    list.appendChild(li);
  });
}

function openFolder(name) {
  activeFolder = name;
  const area = document.getElementById('note-area');
  area.disabled = false;
  document.getElementById('current-folder-name').innerText = name;
  
  let folders = getuserData();
  area.value = folders[name];
  loadFolders(); // refresh list to show active state
  area.focus();
}

// --- INDENTATION & AUTO-SAVE ---
const noteArea = document.getElementById('note-area');

noteArea.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;

    // Set textarea value to: text before caret + tab + text after caret
    this.value = this.value.substring(0, start) + "    " + this.value.substring(end);

    // Put caret in correct place
    this.selectionStart = this.selectionEnd = start + 4;
  }
});

noteArea.addEventListener('input', (e) => {
  if (!activeFolder) return;
  let folders = getuserData();
  folders[activeFolder] = e.target.value;
  saveUserData(folders);
  
  const status = document.getElementById('save-status');
  status.style.opacity = "1";
  setTimeout(() => status.style.opacity = "0", 800);
});