// Client-side JavaScript handling Socket.io connection

const socket = io('http://your-socket-server.com'); // Replace with your server URL

// Authentication flow
function login(username, password) {
    socket.emit('login', { username, password });
}

function logout() {
    socket.emit('logout');
}

// Preferences management
function savePreferences(preferences) {
    socket.emit('savePreferences', preferences);
} 

// Monitoring start/stop
function startMonitoring() {
    socket.emit('startMonitoring');
}

function stopMonitoring() {
    socket.emit('stopMonitoring');
}

// Real-time log display via WebSocket
socket.on('logUpdate', function(log) {
    const logDisplay = document.getElementById('logDisplay');
    logDisplay.innerHTML += `<p>${log}</p>`;
});

// Page navigation
function navigateTo(page) {
    window.location.href = page;
} 

// Example usage
login('user', 'pass');
startMonitoring();

