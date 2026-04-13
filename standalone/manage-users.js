document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
});

function loadUsers() {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';

    // Fake user data
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', subscription: 'Premium', generations: 45 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', subscription: 'Free', generations: 3 },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', subscription: 'Premium', generations: 78 },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', subscription: 'Free', generations: 12 },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', subscription: 'Premium', generations: 156 }
    ];

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.subscription}</td>
            <td>${user.generations}</td>
            <td>
                <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#userTableBody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function editUser(userId) {
    alert(`Edit user ${userId} - Feature not fully implemented`);
}

function deleteUser(userId) {
    if (confirm(`Are you sure you want to delete user ${userId}?`)) {
        alert(`User ${userId} deleted`);
        loadUsers(); // Reload the list
    }
}