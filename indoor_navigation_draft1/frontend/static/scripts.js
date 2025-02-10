const gridGround = document.getElementById("grid-ground");
const gridFirst = document.getElementById("grid-first");
const rows = 10;
const cols = 10;
let mode = "none"; // Modes: 'obstacle', 'room', 'lift', 'stairs', 'start', 'end'
let startRoom = null;
let endRoom = null;
let groundFloorValue = null;
let firstFloorValue = null;
let lifts = { ground: null, first: null };
let count = 0;
let obstacles = [22, 27, 32, 37, 42, 47, 52, 57, 62, 67, 72, 77];
let rooms = [
  0, 2, 7, 9, 20, 29, 40, 49, 50, 59, 70, 79, 90, 92, 94, 95, 97, 99,
];
let lift_demo = [23, 33, 66, 76];
let stairs = [26, 36, 63, 73];

function createGrid(gridElement, floorNumber) {
  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;

    // Only update the room number for 'room' class cells
    if (rooms.includes(i)) {
      // Create a span to show the room number
      const roomText = document.createElement("span");
      roomText.className = "room-text";

      const roomNumber = floorNumber * 100 + (rooms.indexOf(i) + 1); // For example, 301, 302, 303, ...
      roomText.textContent = roomNumber;

      // Add the room number text to the cell
      cell.appendChild(roomText);
    }

    // Only update the lift number for 'lift' class cells
    if (lift_demo.includes(i)) {
      // Create a span to show the lift number
      const liftText = document.createElement("span");
      liftText.className = "lift-text";

      const liftNumber = `L${lift_demo.indexOf(i) + 1}`; // For example, L1, L2, L3, ...
      liftText.textContent = liftNumber;

      // Add the lift number text to the cell
      cell.appendChild(liftText);
    }

    // Only update the stair number for 'stairs' class cells
    if (stairs.includes(i)) {
      // Create a span to show the stair number
      const stairText = document.createElement("span");
      stairText.className = "stair-text";

      const stairNumber = `S${stairs.indexOf(i) + 1}`; // For example, S1, S2, S3, ...
      stairText.textContent = stairNumber;

      // Add the stair number text to the cell
      cell.appendChild(stairText);
    }

    if (rooms.includes(i)) cell.classList.add("room");
    else if (lift_demo.includes(i)) cell.classList.add("lift");
    else if (stairs.includes(i)) cell.classList.add("stairs");
    else if (obstacles.includes(i)) cell.classList.add("obstacle");

    cell.addEventListener("click", () => cellClicked(i, gridElement));
    gridElement.appendChild(cell);
  }
}

// Function to update button states
function updateButtonStates() {
  const canSelect = true;
  document.getElementById("select-start").disabled = !canSelect;
  document.getElementById("select-end").disabled =
    !canSelect || startRoom === null;
  document.getElementById("find-path").disabled =
    !canSelect || startRoom === null || endRoom === null;
}

// Set the mode and update button states accordingly
function setMode(selectedMode) {
  mode = selectedMode;
  document.getElementById("place-obstacles").disabled = mode === "obstacle";
  document.getElementById("place-rooms").disabled = mode === "room";
  document.getElementById("place-lifts").disabled = mode === "lift";
  document.getElementById("place-stairs").disabled = mode === "stairs";
  updateButtonStates();
}

function cellClicked(index, gridElement) {
  const cell = gridElement.querySelector(`.cell[data-index="${index}"]`);
  const isGround = gridElement.id === "grid-ground";

  if (mode === "obstacle") {
    // Toggle obstacles
    cell.classList.toggle("obstacle");
  } else if (mode === "room") {
    // Toggle rooms
    if (cell.classList.contains("room")) {
      cell.classList.remove("room");
    } else {
      cell.classList.add("room");
    }
    updateButtonStates();
  } else if (mode === "lift") {
    // Set lift
    lifts[isGround ? "ground" : "first"] = index;
    // cell.classList.add('lift');
    cell.classList.toggle("lift");
    updateButtonStates();
  } else if (mode === "stairs") {
    // Toggle stairs
    cell.classList.toggle("stairs");
    updateButtonStates();
  } else if (mode === "start") {
    // Select start room
    if (startRoom !== null) {
      const prevStart = gridElement.querySelector(
        `.cell[data-index="${startRoom}"]`
      );
      if (prevStart) prevStart.classList.remove("start");
    }
    if (obstacles.includes(index)) {
      console.log(obstacles);

      alert("Invalid positions.");
    } else {
      startRoom = index;
      console.log(startRoom);
      cell.classList.add("start");
      updateButtonStates();
    }
  } else if (mode === "end") {
    // Select end room
    if (endRoom !== null) {
      const prevEnd = gridElement.querySelector(
        `.cell[data-index="${endRoom}"]`
      );
      console.log(prevEnd);

      if (prevEnd) prevEnd.classList.remove("end");
    }
    if (obstacles.includes(index)) {
      console.log(obstacles);

      alert("Invalid positions.");
    } else {
      endRoom = index;
      console.log(endRoom);
      cell.classList.add("end");
      updateButtonStates();
    }
  }
}

function findShortestPath() {
  if (startRoom === null || endRoom === null) {
    alert("Please select both start and end rooms.");
    return;
  }

  // Reset obstacles_dummy to its original state
  let obstacles_dummy = [...obstacles]; // Create a shallow copy of the original obstacles array

  gridGround.querySelectorAll(".cell").forEach((cell) => {
    const index = parseInt(cell.dataset.index, 10);
    if (
      cell.classList.contains("obstacle") ||
      cell.classList.contains("lift") ||
      cell.classList.contains("stairs") ||
      (cell.classList.contains("room") &&
        index !== startRoom &&
        index !== endRoom)
    ) {
      obstacles_dummy.push(index);
    }
  });

  if (groundFloorValue === firstFloorValue) {
    fetch("/same-floor-path", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: startRoom,
        end: endRoom,
        obstacles: obstacles_dummy,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          console.log("error in animation");
          console.log(data);

          animatePathfinding(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while finding the path in js.");
      });
  } else {
    fetch("/multi-floor-path", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: startRoom,
        end: endRoom,
        lifts: lift_demo,
        stairs: stairs,
        obstacles: obstacles_dummy,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          animatePathfinding(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while finding the path.");
      });
  }
}

function animatePathfinding(paths) {
  const cellsGround = document.querySelectorAll("#grid-ground .cell");
  const cellsFirst = document.querySelectorAll("#grid-first .cell");

  // Clear previous path
  cellsGround.forEach((cell) => cell.classList.remove("current", "path"));
  cellsFirst.forEach((cell) => cell.classList.remove("current", "path"));

  // Animate path
  let step = 0;
  if (groundFloorValue === firstFloorValue) {
    const interval = setInterval(() => {
      if (step < paths.ground.length) {
        const cellIndex = paths.ground[step];
        cellsGround[cellIndex].classList.add("path");
      }

      if (step >= paths.ground.length) {
        clearInterval(interval);
      }
      step++;
    }, 100); // Adjust interval to speed up/slow down the animation
  } else {
    const maxSteps = Math.max(paths.ground.length, paths.first.length);

    const interval = setInterval(() => {
      if (step < paths.ground.length) {
        const cellIndex = paths.ground[step];
        cellsGround[cellIndex].classList.add("path");
      }

      if (step < paths.first.length) {
        const cellIndex = paths.first[step];
        cellsFirst[cellIndex].classList.add("path");
      }

      if (step >= maxSteps) {
        clearInterval(interval);
      }
      step++;
    }, 100); // Adjust interval to speed up/slow down the animation
  }
}

function clearPath() {
  document
    .querySelectorAll(".cell.path")
    .forEach((cell) => cell.classList.remove("path"));
  document
    .querySelectorAll(".cell.current")
    .forEach((cell) => cell.classList.remove("current"));
}

// Add event listeners to buttons to clear path when clicked
document.getElementById("select-start").addEventListener("click", clearPath);
document.getElementById("select-end").addEventListener("click", clearPath);

// Initial state: disable certain buttons
updateButtonStates();

function showFloors() {
  const floorsDiv = document.getElementById("floors");
  floorsDiv.style.display = "block"; // Make the div visible
}

function sameFloorNav() {
  const same = document.getElementById("same-floor-nav");
  const multi = document.getElementById("multi-floor-nav");
  const floorsDiv = document.getElementById("floors");
  const roomSelect = document.getElementById("room-selection");

  floorsDiv.style.display = "none";
  roomSelect.style.display = "block";

  // Toggle visibility of 'hid' and hide 'did'
  if (same.style.display === "none" || same.style.display === "") {
    same.style.display = "block"; // Show the 'hid' div
    multi.style.display = "none"; // Hide the 'did' div
  } else {
    same.style.display = "none"; // Hide the 'hid' div
  }
}

function multiFloorNav() {
  const same = document.getElementById("same-floor-nav");
  const multi = document.getElementById("multi-floor-nav");
  const floorsDiv = document.getElementById("floors");
  const roomSelect = document.getElementById("room-selection");

  roomSelect.style.display = "block";
  floorsDiv.style.display = "none";

  floorsDiv.style.display = "none";

  // Toggle visibility of 'did' and hide 'hid'
  if (multi.style.display === "none" || multi.style.display === "") {
    multi.style.display = "block"; // Show the 'did' div
    same.style.display = "none"; // Hide the 'hid' div
  } else {
    multi.style.display = "none"; // Hide the 'did' div
  }
}

function updateFloor() {
  // Get the selected values from the dropdown menus
  groundFloorValue = document.getElementById("ground-floor-select").value;
  firstFloorValue = document.getElementById("first-floor-select").value;

  // If both floors have been selected, update the floor displays and show grids
  if (groundFloorValue && firstFloorValue) {
    // Clear previous grids first
    const gridGround = document.getElementById("grid-ground");
    const gridFirst = document.getElementById("grid-first");
    gridGround.innerHTML = ""; // Clear ground floor grid
    gridFirst.innerHTML = ""; // Clear first floor grid

    // Update the Ground Floor display
    const groundFloor = document.getElementById("ground-floor");
    groundFloor.querySelector(
      "h2"
    ).textContent = `Source Floor - Floor ${groundFloorValue}`;
    // Show the Ground Floor grid and create it with the appropriate room numbers
    createGrid(gridGround, parseInt(groundFloorValue));
    document.getElementById("grid-ground").style.display = "grid";

    // Update the First Floor display
    const firstFloor = document.getElementById("first-floor");
    firstFloor.querySelector(
      "h2"
    ).textContent = `Destination Floor - Floor ${firstFloorValue}`;
    // Show the First Floor grid and create it with the appropriate room numbers
    createGrid(gridFirst, parseInt(firstFloorValue));
    document.getElementById("grid-first").style.display = "grid";

    // document.getElementById("first-floor").style.display = "block";

    showFloors();
    populateRoomDropdowns();
  } else {
    // If either dropdown is not selected, hide the grids
    document.getElementById("grid-ground").style.display = "none";
  }
  document.getElementById("first-floor").style.display = "block";
}

function updateSameFloor() {
  // Get the selected values from the dropdown menus
  groundFloorValue = document.getElementById("same-floor-select").value;
  firstFloorValue = groundFloorValue;

  // If both floors have been selected, update the floor displays and show grids
  if (groundFloorValue) {
    // Clear previous grids first
    const gridGround = document.getElementById("grid-ground");
    // const gridFirst = document.getElementById("grid-first");
    gridGround.innerHTML = ""; // Clear ground floor grid

    // Update the Ground Floor display
    const groundFloor = document.getElementById("ground-floor");
    groundFloor.querySelector(
      "h2"
    ).textContent = `Source and Destination Floor - Floor ${groundFloorValue}`;
    // Show the Ground Floor grid and create it with the appropriate room numbers
    createGrid(gridGround, parseInt(groundFloorValue));
    document.getElementById("grid-ground").style.display = "grid";

    showFloors();
    populateSameRoomDropdowns();
  } else {
    // If either dropdown is not selected, hide the grids
    document.getElementById("grid-ground").style.display = "none";
  }
  document.getElementById("first-floor").style.display = "none";
}

// Populate the same-floor room selection dropdowns
function populateSameRoomDropdowns() {
  const startRoomSelect = document.getElementById("start-room-select");
  const endRoomSelect = document.getElementById("end-room-select");

  // Clear previous options
  startRoomSelect.innerHTML =
    '<option value="" disabled selected>Select a room</option>';
  endRoomSelect.innerHTML =
    '<option value="" disabled selected>Select a room</option>';

  // Populate both dropdowns with room numbers
  rooms.forEach((room, index) => {
    const roomOption = document.createElement("option");
    roomOption.value = room;
    roomOption.textContent = `Room ${
      parseInt(groundFloorValue) * 100 + (rooms.indexOf(room) + 1)
    }`;
    console.log(
      parseInt(groundFloorValue) * 100 + (rooms.indexOf(room) + 1),
      parseInt(groundFloorValue)
    );

    // Add room to start room selects
    startRoomSelect.appendChild(roomOption.cloneNode(true));
  });

  // Populate both dropdowns with room numbers
  rooms.forEach((room, index) => {
    const roomOption = document.createElement("option");
    roomOption.value = room;
    roomOption.textContent = `Room ${
      parseInt(firstFloorValue) * 100 + (rooms.indexOf(room) + 1)
    }`;

    // Add room to end room selects
    endRoomSelect.appendChild(roomOption);
  });

  startRoomSelect.addEventListener("change", () => {
    // Assuming rooms are indexed the same as cell numbers
    mode = "start";
    cellClicked(parseInt(startRoomSelect.value, 10), gridGround); // Call your cellClicked function here
    // mode = 'none';
  });

  endRoomSelect.addEventListener("change", () => {
    // Assuming rooms are indexed the same as cell numbers
    mode = "end";
    cellClicked(parseInt(endRoomSelect.value, 10), gridGround); // Call your cellClicked function here
    // mode = 'none';
  });
}

// Populate the multi-floor room selection dropdowns
function populateRoomDropdowns() {
  const startRoomSelect = document.getElementById("start-room-select");
  const endRoomSelect = document.getElementById("end-room-select");

  // Clear previous options
  startRoomSelect.innerHTML =
    '<option value="" disabled selected>Select a room</option>';
  endRoomSelect.innerHTML =
    '<option value="" disabled selected>Select a room</option>';

  const gridGround = document.getElementById("grid-ground");
  const gridFirst = document.getElementById("grid-first");

  // Populate both dropdowns with room numbers
  rooms.forEach((room, index) => {
    const roomOption = document.createElement("option");
    roomOption.value = room;
    roomOption.textContent = `Room ${
      parseInt(groundFloorValue) * 100 + (rooms.indexOf(room) + 1)
    }`;

    console.log(
      parseInt(groundFloorValue) * 100 + (rooms.indexOf(room) + 1),
      parseInt(groundFloorValue)
    );

    // Add room to start room selects
    startRoomSelect.appendChild(roomOption.cloneNode(true));
  });

  // Populate both dropdowns with room numbers
  rooms.forEach((room, index) => {
    const roomOption = document.createElement("option");
    roomOption.value = room;
    roomOption.textContent = `Room ${
      parseInt(firstFloorValue) * 100 + (rooms.indexOf(room) + 1)
    }`;

    // Add room to end room selects
    endRoomSelect.appendChild(roomOption);
  });

  startRoomSelect.addEventListener("change", () => {
    // Assuming rooms are indexed the same as cell numbers
    mode = "start";
    cellClicked(parseInt(startRoomSelect.value, 10), gridGround); // Call your cellClicked function here
    // mode = 'none';
  });

  endRoomSelect.addEventListener("change", () => {
    // Assuming rooms are indexed the same as cell numbers
    mode = "end";
    cellClicked(parseInt(endRoomSelect.value, 10), gridFirst); // Call your cellClicked function here
    // mode = 'none';
  });
}

// Handling user input of signal strength
document.getElementById("dataForm").addEventListener("submit", function(event) {
  event.preventDefault();  // Prevent the form from submitting normally

  // Collect the form data into an array
  let data = [
      document.getElementById("field1").value,
      document.getElementById("field2").value,
      document.getElementById("field3").value,
      document.getElementById("field4").value
  ];

   // Check if all fields contain valid numbers (integers or floats)
   for (let i = 0; i < data.length; i++) {
    let trimmedValue = data[i].trim();
    if (isNaN(trimmedValue) || trimmedValue === "") {
      alert(`Please enter a valid number in router ${i + 1}.`);
      return;  // Stop processing further if validation fails
    }
  }
  console.log(data);
  

  // Send the data to the backend via a POST request
  fetch('/submit-form', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: data })  // Send the data as an array in JSON format
  })
  .then(response => response.json())
  .then(data => {
      console.log('Success:', data);
      startRoom = data.index;
      findShortestPath()
      alert('Data submitted successfully!');
  })
  .catch((error) => {
      console.error('Error:', error);
      alert('There was an error submitting the data.');
  });
});

