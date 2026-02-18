const textarea = document.getElementById("note");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

// Load saved note
window.addEventListener("load", () => {
    textarea.value = localStorage.getItem("minimal-notepad") || "";
});

// Auto-save on typing
textarea.addEventListener("input", () => {
    localStorage.setItem("minimal-notepad", textarea.value);
});

// Download note as .txt file
downloadBtn.addEventListener("click", () => {
    const blob = new Blob([textarea.value], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "note.txt";
    link.click();
    URL.revokeObjectURL(link.href);
});

// Clear note
clearBtn.addEventListener("click", () => {
    if (confirm("Clear all text?")) {
        textarea.value = "";
        localStorage.removeItem("minimal-notepad");
    }
});
