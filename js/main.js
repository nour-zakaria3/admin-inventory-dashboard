//open and close sidebar
var sidebarOpen = false;
var sidebar = document.getElementById("sidebar");

function openSidebar() {
    if (!sidebarOpen && sidebar) {
        sidebar.classList.add("sidebar-responsive");
        sidebarOpen = true;
    }
}

function closeSidebar() {
    if (sidebarOpen && sidebar) {
        sidebar.classList.remove("sidebar-responsive");
        sidebarOpen = false;
    }
}

// API
const API_URL = "http://localhost:3000";


//loading
function hideLoading() {
    const loading = document.getElementById("loading");
    const content = document.getElementById("main-container") || document.getElementById("dashboard-content");
    if (loading) loading.style.display = "none";
    if (content) content.style.display = "block";
}

function showLoading() {
    const loading = document.getElementById("loading");
    if (loading) loading.style.display = "flex";
}
// error

function showError(message) {
    const errorBox = document.getElementById("error-message");
    if (errorBox) errorBox.textContent = message;
}

//empty
function showEmpty(message) {
    const emptyBox = document.getElementById("empty-message");
    if (emptyBox) emptyBox.textContent = message;
}