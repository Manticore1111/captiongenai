document.addEventListener('DOMContentLoaded', function() {
    loadReports();
});

function loadReports() {
    // Fake data
    document.getElementById('totalRevenue').textContent = Math.floor(Math.random() * 10000) + 1000;
    document.getElementById('totalUsersReport').textContent = Math.floor(Math.random() * 10000) + 1000;
    document.getElementById('activeUsers').textContent = Math.floor(Math.random() * 1000) + 100;
    document.getElementById('todayGenerations').textContent = Math.floor(Math.random() * 1000) + 100;
    document.getElementById('weekGenerations').textContent = Math.floor(Math.random() * 10000) + 1000;
    document.getElementById('monthGenerations').textContent = Math.floor(Math.random() * 50000) + 10000;
    document.getElementById('avgSession').textContent = (Math.random() * 10 + 1).toFixed(1) + ' min';

    // Simple chart simulation (in real app, use Chart.js or similar)
    drawSimpleChart('revenueChart', [100, 200, 150, 300, 250, 400, 350]);
    drawSimpleChart('userChart', [50, 80, 120, 150, 200, 250, 300]);
    drawSimpleChart('platformChart', [300, 250, 200, 150, 100, 80]); // TikTok, IG, YT, Twitter, FB, LinkedIn
}

function drawSimpleChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const maxData = Math.max(...data);
    const barWidth = width / data.length;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#00bcd4';

    data.forEach((value, index) => {
        const barHeight = (value / maxData) * (height - 20);
        const x = index * barWidth;
        const y = height - barHeight - 10;
        ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
    });
}

function exportReport() {
    alert('Report exported successfully! (Feature simulated)');
}