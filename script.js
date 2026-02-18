/**
 * ZEN-NOTES MASTER SCRIPT
 * Full Build: Auth, Folder Logic, and Theme Shaders
 */

// --- 1. DATA INITIALIZATION ---
let isSignUpMode = false;

// Load folders or create default
let folders = JSON.parse(localStorage.getItem('zen_notes_v6')) || [
    { id: Date.now(), name: "Journal", notes: "" }
];
let currentFolderId = folders[0].id;

// --- 2. THE ENGINE (Runs on Load) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Zen-Notes Engine Online");

    // Attach Main Auth Listeners
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleBtn = document.getElementById('toggle-link');

    if (submitBtn) submitBtn.addEventListener('click', handleAuth);
    if (toggleBtn) toggleBtn.addEventListener('click', toggleAuthMode);

    // Apply Saved Theme shader on boot
    const savedTheme = localStorage.getItem('zen_theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }

    // Check if we should stay locked (default)
    document.body.classList.add('locked');
});

// --- 3. AUTHENTICATION & VAULT ---
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    const title = document.getElementById('auth-header');
    const btn = document.getElementById('auth-submit-btn');
    const link = document.getElementById('toggle-link');
    const hint = document.getElementById('toggle-text');

    if (isSignUpMode) {
        title.innerText = "Create Account";
        btn.innerText = "Register";
        hint.innerText = "Already a member?";
        link.innerText = "Sign In";
    } else {
        title.innerText = "Zen-Notes";
        btn.innerText = "Sign In";
        hint.innerText = "New here?";
        link.innerText = "Sign Up";
    }
}

function handleAuth() {
    const userIn = document.getElementById('username-input').value.trim();
    const passIn = document.getElementById('password-input').value.trim();
    
    if (!userIn || !passIn) {
        alert("Please fill in all fields.");
        return;
    }

    if (isSignUpMode) {
        localStorage.setItem('zen_user', userIn);
        localStorage.setItem('zen_pass', passIn);
        alert("Account Registered. You can now Sign In.");
        toggleAuthMode();
    } else {
        const savedUser = localStorage.getItem('zen_user');
        const savedPass = localStorage.getItem('zen_pass');

        if (userIn === savedUser && passIn === savedPass) {
            // UNLOCK UI
            document.body.classList.
