const grids = {
    ground: document.getElementById('ground-grid'),
    next: document.getElementById('next-grid'),
};

const rows = 10;
const cols = 10;
let mode = 'none';  
let startRoom = { ground: null, next: null };
let endRoom = { ground: null, next: null };
let placedRooms = { ground: [], next: [] };
let placedLifts = { ground: [], next: [] };

// Initialize grids
Object.keys(grids).forEach(gridId => {
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.dataset.grid = gridId;
        cell.addEventListener('click', () => cellClicked(i, gridId));
        grids[gridId].appendChild(cell);
    }
});

// Function to update button states for the selected grid
function updateButtonStates(gridId) {
    const canSelect = placedRooms[gridId].length >= 2;
    document.getElementById(`${gridId}-select-start`).disabled = !canSelect;
    document.getElementById(`${gridId}-select-end`).disabled = !canSelect || startRoom[gridId] === null;
    document.getElementById(`${gridId}-find-path`).disabled = !canSelect || startRoom[gridId] === null || endRoom[gridId] === null;
}

// Set the mode and update button states accordingly for the specific grid
function setMode(selectedMode, gridId) {
    mode = selectedMode;
    document.getElementById(`${gridId}-place-obstacles`).disabled = (mode === 'obstacle');
    document.getElementById(`${gridId}-place-rooms`).disabled = (mode === 'room');
    document.getElementById(`${gridId}-place-lift`).disabled = (mode === 'lift');
    updateButtonStates(gridId);
}

// When a cell is clicked in either grid
function cellClicked(index, gridId) {
    const cell = document.querySelector(`.cell[data-index="${index}"][data-grid="${gridId}"]`);

    if (mode === 'obstacle') {
        cell.classList.toggle('obstacle');
    } else if (mode === 'room') {
        if (cell.classList.contains('room')) {
            cell.classList.remove('room');
            placedRooms[gridId] = placedRooms[gridId].filter(room => room !== index);
        } else {
            cell.classList.add('room');
            placedRooms[gridId].push(index);
        }
        updateButtonStates(gridId);
    } else if (mode === 'start') {
        // Remove previous start class
        if (startRoom[gridId] !== null) {
            const prevStart = document.querySelector(`.cell[data-index="${startRoom[gridId]}"][data-grid="${gridId}"]`);
            prevStart.classList.remove('start');
            // Restore 'lift' class if the previous start was a lift
            if (placedLifts[gridId].includes(startRoom[gridId])) {
                prevStart.classList.add('lift');
            }
        }
        // Set new start
        startRoom[gridId] = index;
        cell.classList.add('start');
        cell.classList.remove('lift'); // Ensure lift class is removed
        updateButtonStates(gridId);
    } else if (mode === 'end') {
        // Remove previous end class
        if (endRoom[gridId] !== null) {
            const prevEnd = document.querySelector(`.cell[data-index="${endRoom[gridId]}"][data-grid="${gridId}"]`);
            prevEnd.classList.remove('end');
            // Restore 'lift' class if the previous end was a lift
            if (placedLifts[gridId].includes(endRoom[gridId])) {
                prevEnd.classList.add('lift');
            }
        }
        // Set new end
        endRoom[gridId] = index;
        cell.classList.add('end');
        cell.classList.remove('lift'); // Ensure lift class is removed
        updateButtonStates(gridId);
    } else if (mode === 'lift') {
        // Toggle lift class
        if (cell.classList.contains('lift')) {
            cell.classList.remove('lift');
            placedLifts[gridId] = placedLifts[gridId].filter(lift => lift !== index);
        } else {
            cell.classList.add('lift');
            placedLifts[gridId].push(index);
        }
    }
}

// Function to find the shortest path in a specific grid
function findShortestPath(gridId) {
    if (startRoom[gridId] === null || endRoom[gridId] === null) {
        alert('Please select both start and end rooms.');
        return;
    }

    const obstacles = [];
    document.querySelectorAll(`.cell.obstacle[data-grid="${gridId}"]`).forEach(cell => {
        obstacles.push(parseInt(cell.dataset.index, 10));
    });

    // Automatically set all rooms and lifts (except start and end) as obstacles
    placedRooms[gridId].forEach(index => {
        if (index !== startRoom[gridId] && index !== endRoom[gridId]) {
            obstacles.push(index);
        }
    });

    placedLifts[gridId].forEach(index => {
        if (index !== startRoom[gridId] && index !== endRoom[gridId]) {
            obstacles.push(index);
        }
    });

    // Pass grid-specific data to the backend
    fetch('/path', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ start: startRoom[gridId], end: endRoom[gridId], obstacles })
    })
    .then(response => response.json())
    .then(data => {
        const cells = document.querySelectorAll(`.cell[data-grid="${gridId}"]`);
        cells.forEach(cell => cell.classList.remove('path'));

        data.forEach(index => document.querySelector(`.cell[data-index="${index}"][data-grid="${gridId}"]`).classList.add('path'));
    })
    .catch(error => console.error('Error:', error));
}

// Initialize both grids
updateButtonStates('ground');
updateButtonStates('next');