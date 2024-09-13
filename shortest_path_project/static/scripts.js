const grid = document.getElementById('grid');
const rows = 10;
const cols = 10;
let mode = 'none';  // Modes: 'obstacle', 'room', 'start', 'end'
let startRoom = null;
let endRoom = null;
let placedRooms = [];
let liftStairs = [];

// Initialize grid
for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', () => cellClicked(i));
    grid.appendChild(cell);
}

// Function to update button states
function updateButtonStates() {
    const canSelect = placedRooms.length >= 2;
    document.getElementById('select-start').disabled = !canSelect;
    document.getElementById('select-end').disabled = !canSelect || startRoom === null;
    document.getElementById('find-path').disabled = !canSelect || startRoom === null || endRoom === null;
}

// Set the mode and update button states accordingly
function setMode(selectedMode) {
    mode = selectedMode;
    document.getElementById('place-obstacles').disabled = (mode === 'obstacle');
    document.getElementById('place-rooms').disabled = (mode === 'room');
    document.getElementById('select-lift').disabled = (mode === 'lift');
    updateButtonStates();
}

function cellClicked(index) {
    const cell = document.querySelector(`.cell[data-index="${index}"]`);

    if (mode === 'obstacle') {
        // Toggle obstacles
        cell.classList.toggle('obstacle');
    } else if (mode === 'room') {
        // Toggle rooms
        if (cell.classList.contains('room')) {
            cell.classList.remove('room');
            placedRooms = placedRooms.filter(room => room !== index);
        } else {
            cell.classList.add('room');
            placedRooms.push(index);
        }
        // Update button states
        updateButtonStates();
    } else if (mode === 'start') {
        // Select start room
        if (startRoom !== null) {
            const prevStart = document.querySelector(`.cell[data-index="${startRoom}"]`);
            prevStart.classList.remove('start');
        }
        startRoom = index;
        cell.classList.add('start');
        // Update button states
        updateButtonStates();
    } else if (mode === 'end') {
        // Select end room
        if (endRoom !== null) {
            const prevEnd = document.querySelector(`.cell[data-index="${endRoom}"]`);
            prevEnd.classList.remove('end');
        }
        endRoom = index;
        cell.classList.add('end');
        // Update button states
        updateButtonStates();

    } else if (mode === 'lift') {
        // Toggle lift/stairs
        if (cell.classList.contains('lift')) {
            cell.classList.remove('lift');
            liftStairs = liftStairs.filter(lift => lift !== index);
        } else {
            cell.classList.add('lift');
            liftStairs.push(index);
        }
        // Update button states
        updateButtonStates();
    }
}

function findShortestPath() {
    if (startRoom === null || endRoom === null) {
        alert('Please select both start and end rooms.');
        return;
    }

    // Collect obstacles (including rooms and lifts that aren't start or end points)
    const obstacles = [];
    document.querySelectorAll('.cell.obstacle').forEach(cell => {
        obstacles.push(parseInt(cell.dataset.index, 10));
    });

    // Add rooms and lifts as obstacles if they are not start or end points
    placedRooms.forEach(index => {
        if (index !== startRoom && index !== endRoom) {
            obstacles.push(index);
        }
    });
    liftStairs.forEach(index => {
        if (index !== startRoom && index !== endRoom) {
            obstacles.push(index);
        }
    });

    fetch('/path', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ start: startRoom, end: endRoom, obstacles })
    })
    .then(response => response.json())
    .then(data => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('path'));

        data.forEach(index => document.querySelector(`.cell[data-index="${index}"]`).classList.add('path'));
    })
    .catch(error => console.error('Error:', error));
}

// Initial state: disable certain buttons
updateButtonStates();