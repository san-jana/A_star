// map initialization
// var map = L.map('map').setView([12.969339, 79.156843],17);

const key = "z3ZCYqfDSld3jpkFNkcr";

const map = L.map("map").fitBounds([[-65, -160], [65, 160]]);
map.setView([12.969339, 79.156843],16);

const scale = devicePixelRatio > 1.5 ? "@2x" : "";

var geomap = L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}${scale}.png?key=${key}`, {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>, ' +
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        crossOrigin: true
});

// by default geo satellite view 
geomap.addTo(map);
L.control.maptilerGeocoding({ apiKey: key }).addTo(map);


//osm layer
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// map tiles
var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});

var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
});

var geosat = L.tileLayer(`https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.png?key=${key}`,{ //style URL
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
  });

// osm.addTo(map);
 

// start marker
// var start_marker = L.marker([12.969339, 79.156843], {draggable: true });
// var latlng = start_marker.getLatLng();

// popup = start_marker.bindPopup("popupContent").openPopup();
// start_marker.addTo(map)

// //goal marker
// var goal_marker = L.marker([12.968219565344793, 79.15044013020095], {draggable: true });
// popup = goal_marker.bindPopup("popupContent").openPopup();
// goal_marker.addTo(map)

var start_marker = null;
var goal_marker = null;

// Layer controller

// var baseMaps = {
//     "Open Street 1": osm,
//     "Open Street 2": osmHOT,
//     "Google Street": googleStreets,
//     "Satellite": geosat
// };

// var overlayMaps = {
//     "Marker": start_marker,
//     "second marker": goal_marker
// };

// var layerControl = L.control.layers(baseMaps, overlayMaps);
// layerControl.addTo(map);

// Pan to the marker's position
// map.panTo(start_marker.getLatLng());



// Convert marker to GeoJSON
// let start_geojson = start_marker.toGeoJSON();
// let goal_geojson = goal_marker.toGeoJSON();
// console.log(start_geojson);
// console.log(goal_geojson);



// finding path using A*

function drawPath(path) {
    if (!Array.isArray(path) || !path.every(coord => Array.isArray(coord) && coord.length === 2 && coord.every(Number.isFinite))) {
        console.error("Invalid path format");
        return;
    }

    var polyline = L.polyline(path, { color: 'blue' }).addTo(map);
    map.fitBounds(polyline.getBounds());  // Adjust map view to fit the path
}




class Node {
    constructor(lat, lng, g = 0, h = 0) {
        this.lat = lat;
        this.lng = lng;
        this.g = g;  // Cost from start to this node
        this.h = h;  // Heuristic cost to goal
        this.f = g + h;  // Total cost
        this.prev = null;  // For path reconstruction
    }

    // Comparison method for priority queue
    compareTo(other) {
        return this.f - other.f;
    }
}

// Manhattan heuristic for lat/lng (simplified for small distances)
function heuristicManhattan(node1, node2) {
    return Math.abs(node1.lat - node2.lat) + Math.abs(node1.lng - node2.lng);
}

function getNeighbors(node, map) {
    const zoomLevel = map.getZoom();  // Get the current zoom level
    // const baseStep = 0.001;  // Base step size
    
    // // Adjust step size based on zoom level
    // const step = baseStep / Math.pow(2, zoomLevel - 15);

    const step = 0.0001;
    
    // Generate potential neighbors
    const potentialNeighbors = [
        new Node(node.lat + step, node.lng),
        new Node(node.lat - step, node.lng),
        new Node(node.lat, node.lng + step),
        new Node(node.lat, node.lng - step)
    ];

    // Filter out neighbors that are out of bounds
    return potentialNeighbors.filter(neighbor => {
        return neighbor.lat >= -90 && neighbor.lat <= 90 &&
               neighbor.lng >= -180 && neighbor.lng <= 180;
    });
}


// A* algorithm implementation

    class PriorityQueue {
        constructor() {
            this.queue = [];
        }

        enqueue(node) {
            this.queue.push(node);
            this.queue.sort((a, b) => a.f - b.f);
        }

        dequeue() {
            return this.queue.shift();
        }

        length() {
            return this.queue.length;
        }

        find(value) {
            return this.queue.find(value);
        }
    };

    function roundToDecimal(num, decimals) {
        return parseFloat(num.toFixed(decimals));
    }

   
    function get_path(startLatLng, goalLatLng) {
        const startNode = new Node(startLatLng.lat, startLatLng.lng);
        const goalNode = new Node(goalLatLng.lat, goalLatLng.lng);
        
        let unvisited = new PriorityQueue();  // Use the priority queue
        let visited = new Set();
    
        unvisited.enqueue(startNode);
    
        while (unvisited.length() > 0) {
            const currentNode = unvisited.dequeue();
            console.log("Current Node:", currentNode);
            
            if (roundToDecimal(currentNode.lat, 3) === roundToDecimal(goalNode.lat,3) && roundToDecimal(currentNode.lng,3) === roundToDecimal(goalNode.lng,3)) {
                console.log("Goal reached");
                let path = [];
                let temp = currentNode;
    
                while (temp.prev) {
                    path.push([temp.lat, temp.lng]);
                    temp = temp.prev;
                }
    
                path.push([startNode.lat, startNode.lng]);
                path.reverse();
                console.log("Path:", path);
                drawPath(path)
                return;
            }
            
            console.log("Adding to visited");
            visited.add(`${currentNode.lat},${currentNode.lng}`);
    
            let neighbours = getNeighbors(currentNode, map);
    
            for (let neighbour of neighbours) {
                console.log("Checking neighbours");
                if (visited.has(`${neighbour.lat},${neighbour.lng}`)) {
                    console.log("Already visited");
                    continue;
                }
    
                neighbour.g = currentNode.g + 1;
                neighbour.h = heuristicManhattan(neighbour, goalNode);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.prev = currentNode;
    
                if (!unvisited.find(n => n.lat === neighbour.lat && n.lng === neighbour.lng)) {
                    unvisited.enqueue(neighbour);
                }
            }
        }
    
        console.log("No path found");
        return null;
    }
    



start_marker = L.marker([12.9693, 79.1568], {draggable: true });
goal_marker = L.marker([12.9682, 79.1504], {draggable: true });

start_marker.addTo(map);
goal_marker.addTo(map);

// Handle clicks on the map
function onClick(e) {

get_path(start_marker.getLatLng(), goal_marker.getLatLng());

// const path = [
//     [12.9693, 79.1568],
//     [12.9682, 79.1504]
// ];
// drawPath(path);

    // console.log("Map clicked at: ", e.latlng);
//     start_marker = L.marker([12.969339, 79.156843], {draggable: true });
//     goal_marker = L.marker([12.968219565344793, 79.15044013020095], {draggable: true });

//     get_path(start_marker.getLatLng(), goal_marker.getLatLng());


    // // debug
    // console.log("Map clicked at: ", e.latlng);

    // if (!start_marker) {
    //     // Set start marker if not already set
    //     start_marker = L.marker(e.latlng, { draggable: true }).addTo(map);
    //     console.log("start marker set: ", e.latlng);
    //     // Attach an event listener to recalculate the path when the marker is dragged
    //     start_marker.on('dragend', function() {
    //         if (goal_marker) {
    //             get_path(start_marker.getLatLng(), goal_marker.getLatLng());
    //         }
    //     });
    // } else if (!goal_marker) {
    //     // Set goal marker if not already set
    //     goal_marker = L.marker(e.latlng, { draggable: true }).addTo(map);
    //     console.log("goal marker set: ", e.latlng);
    //     // Attach an event listener to recalculate the path when the marker is dragged
    //     goal_marker.on('dragend', function() {
    //         if (start_marker) {
    //             get_path(start_marker.getLatLng(), goal_marker.getLatLng());
    //         }
    //     });

    //     // Calculate and draw the path
    //     get_path(start_marker.getLatLng(), goal_marker.getLatLng());
    // } 

    // if(start_marker && goal_marker) {
    //     // If both markers are set, clear the map and reset markers
    //     map.eachLayer((layer) => {
    //         if (layer instanceof L.Marker || layer instanceof L.Polyline) {
    //             map.removeLayer(layer);
    //         }

    //         start_marker = null;
    //         goal_marker = null;
    //     });
        
        
    // }
}

// Attach the click event to the map
map.on('click', onClick);


// A* algorithm to set path


// using http responses
// function runAStar(startLatLng, goalLatLng, grid) {
//     let start = latLngToGrid(startLatLng, bounds);
//     let goal = latLngToGrid(goalLatLng, bounds);

//     fetch('http://127.0.0.1:5000/run_astar', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             start: [start[0], start[1]],
//             goal: [goal[0], goal[1]]
//         }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Path:', data.path);
//         plotPathOnMap(data.path);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
// }
