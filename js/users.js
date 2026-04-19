const USERS_API = `${API_URL}/users`;

async function loadUsers() {
    showLoading();
    try {
        const res = await fetch(USERS_API);
        const users = await res.json();
        renderUsers(users);
    } catch (error) { showError("Error loading users"); }
    finally { hideLoading(); }
}

function renderUsers(users) {
    const tbody = document.getElementById("users-body");
    tbody.innerHTML = users.map(user => `
        <tr>
            <td><img src="${user.avatar}" class="user-avatar" width="40"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <select onchange="changeRole('${user.id}', this.value)" class="role-select">
                    <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
                    <option value="User" ${user.role === 'User' ? 'selected' : ''}>User</option>
                </select>
            </td>
            <td>
                <button onclick="deleteUser('${user.id}')" class="delete-btn"><span class="material-symbols-outlined">delete</span></button>
            </td>
        </tr>`).join('');
}

async function changeRole(id, newRole) {
    await fetch(`${USERS_API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
    });
}

async function deleteUser(id) {
    if (confirm("Delete user?")) {
        await fetch(`${USERS_API}/${id}`, { method: "DELETE" });
        loadUsers();
    }
}

document.addEventListener("DOMContentLoaded", loadUsers);