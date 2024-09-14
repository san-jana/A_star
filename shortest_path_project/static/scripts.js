const grids = ['grid1', 'grid2'];
const rows = 10;
const cols = 10;
let mode = 'none';  // Modes: 'obstacle', 'room', 'start', 'end', 'lift'
let startRoom = { grid1: null, grid2: null };
let endRoom = { grid1: null, grid2: null };
let placedRooms = { grid1: [], grid2: [] };
let placedLifts = { grid1: [], grid2: [] };

// Initialize grids
grids.forEach(gridId => {
    const gridElement = document.getElementById(gridId);
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.dataset.grid = gridId;
        cell.addEventListener('click', () => cellClicked(i, gridId));
        gridElement.appendChild(cell);
    }
});

// Modify button state logic to allow selecting end room without a start room
function updateButtonStates() {
    const canSelect = Object.values(placedRooms).some(rooms => rooms.length >= 2) || Object.values(placedLifts).some(lifts => lifts.length >= 2);
    document.getElementById('select-start').disabled = !canSelect;
    document.getElementById('select-end').disabled = !canSelect;
    document.getElementById('find-path').disabled = Object.values(startRoom).every(room => room === null) && Object.values(endRoom).every(room => room === null);
}

function setMode(selectedMode) {
    mode = selectedMode;
    ['place-obstacles', 'place-rooms', 'place-lift'].forEach(button => {
        document.getElementById(button).disabled = (mode === button.split('-')[1]);
    });
    updateButtonStates();
}

// Update cellClicked function to update the state even if only the end room is selected first
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
        updateButtonStates();
    } else if (mode === 'lift') {
        if (cell.classList.contains('lift')) {
            cell.classList.remove('lift');
            placedLifts[gridId] = placedLifts[gridId].filter(lift => lift !== index);
        } else {
            cell.classList.add('lift');
            placedLifts[gridId].push(index);
        }
        updateButtonStates();
    } else if (mode === 'start') {
        if (!cell.classList.contains('room') && !cell.classList.contains('lift')) {
            alert('Please select a valid room or lift as the start.');
            return;
        }
        if (startRoom[gridId] !== null) {
            const prevStart = document.querySelector(`.cell[data-index="${startRoom[gridId]}"][data-grid="${gridId}"]`);
            prevStart.classList.remove('start');
            if (placedLifts[gridId].includes(startRoom[gridId])) {
                prevStart.classList.add('lift');
            }
        }
        startRoom[gridId] = index;
        cell.classList.add('start');
        cell.classList.remove('lift');
        updateButtonStates();
    } else if (mode === 'end') {
        if (!cell.classList.contains('room') && !cell.classList.contains('lift')) {
            alert('Please select a valid room or lift as the end.');
            return;
        }
        if (endRoom[gridId] !== null) {
            const prevEnd = document.querySelector(`.cell[data-index="${endRoom[gridId]}"][data-grid="${gridId}"]`);
            prevEnd.classList.remove('end');
            if (placedLifts[gridId].includes(endRoom[gridId])) {
                prevEnd.classList.add('lift');
            }
        }
        endRoom[gridId] = index;
        cell.classList.add('end');
        cell.classList.remove('lift');
        updateButtonStates();
    }
}

// Pathfinding for a specific grid
function findShortestPath(gridId) {
    // If both start and end points are selected, continue as usual
    if (startRoom[gridId] !== null && endRoom[gridId] !== null) {
        findPath(gridId);
        return;
    }

    // If start or end room is missing, attempt to auto-assign to nearest lift/stair
    if (startRoom[gridId] === null || endRoom[gridId] === null) {
        if (placedLifts[gridId].length === 0) {
            alert(`No lifts/stairs on ${gridId}. Path cannot be found.`);
            return;
        }

        // If start room is missing, assign it to the nearest lift/stair
        if (startRoom[gridId] === null) {
            startRoom[gridId] = findNearestLiftOrStair(gridId, endRoom[gridId]);
            if (startRoom[gridId] === null) {
                alert(`No valid path found on ${gridId}.`);
                return;
            } else {
                document.querySelector(`.cell[data-index="${startRoom[gridId]}"][data-grid="${gridId}"]`).classList.add('start');
            }
        }

        // If end room is missing, assign it to the nearest lift/stair
        if (endRoom[gridId] === null) {
            endRoom[gridId] = findNearestLiftOrStair(gridId, startRoom[gridId]);
            if (endRoom[gridId] === null) {
                alert(`No valid path found on ${gridId}.`);
                return;
            } else {
                document.querySelector(`.cell[data-index="${endRoom[gridId]}"][data-grid="${gridId}"]`).classList.add('end');
            }
        }
    }

    // Once the missing start or end room is filled, proceed with pathfinding
    findPath(gridId);
}

function findNearestLiftOrStair(gridId, fromIndex) {
    // Use a simple BFS or any shortest path algorithm to find the nearest lift/stair
    let minDistance = Infinity;
    let nearestLiftOrStair = null;

    placedLifts[gridId].forEach(liftIndex => {
        const distance = calculateManhattanDistance(fromIndex, liftIndex);
        if (distance < minDistance) {
            minDistance = distance;
            nearestLiftOrStair = liftIndex;
        }
    });

    return nearestLiftOrStair;
}

function calculateManhattanDistance(index1, index2) {
    const x1 = index1 % cols;
    const y1 = Math.floor(index1 / cols);
    const x2 = index2 % cols;
    const y2 = Math.floor(index2 / cols);
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function findPath(gridId) {
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

    // Send grid data to the backend or handle pathfinding here
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


// Common pathfinding for both grids
function findPathForBothGrids() {
    grids.forEach(gridId => findShortestPath(gridId));
}


// Add event listener for common pathfinding button
document.getElementById('find-path').addEventListener('click', findPathForBothGrids);

// Initial state: disable certain buttons
updateButtonStates();
