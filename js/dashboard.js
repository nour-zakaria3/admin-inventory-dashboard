// Load Stats
async function loadStats() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        if (!data) {
            showEmpty("No stats available");
            return;
        }

        document.getElementById("orders-count").textContent = data.orders;
        document.getElementById("users-count").textContent = data.users;
        document.getElementById("revenue-count").textContent = `$${data.revenue}`;
    } catch (error) {
        showError("Failed to load stats");
    }
}

// Users Chart
async function loadChartData() {
    try {
        const res = await fetch(`${API_URL}/chartData`);
        if (!res.ok) throw new Error();
        const realData = await res.json();

        if (!realData.months || realData.months.length === 0) {
            showEmpty("No users chart data");
            return;
        }

        const userChart = document.getElementById('users-chart');
        new Chart(userChart, {
            type: 'bar',
            data: {
                labels: realData.months,
                datasets: [{
                    label: 'Users',
                    data: realData.users,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(255, 86, 86, 0.7)',
                        'rgba(120, 255, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ]
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    } catch (error) {
        showError("Failed to load users chart");
    }
}

// Revenue Chart
async function loadRevenueData() {
    try {
        const res = await fetch(`${API_URL}/chartData`);
        if (!res.ok) throw new Error();
        const realD = await res.json();

        const ctx = document.getElementById('orders-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: realD.months,
                datasets: [
                    {
                        label: 'Revenue ($)',
                        data: realD.revenue,
                        backgroundColor: 'rgba(0, 200, 83, 0.2)',
                        borderColor: 'rgba(0, 200, 83, 1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Orders',
                        data: realD.orders,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { position: 'left' }, y1: { position: 'right' } }
            }
        });
    } catch (error) {
        showError("Failed to load revenue chart");
    }
}

// Init Dashboard
async function initDashboard() {
    showLoading();
    try {
        await Promise.all([loadStats(), loadChartData(), loadRevenueData()]);
    } catch (error) {
        showError("Something went wrong");
    }
    hideLoading();
}
document.addEventListener("DOMContentLoaded", initDashboard);