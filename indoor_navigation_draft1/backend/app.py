from flask import Flask, request, jsonify, render_template
from collections import defaultdict
import heapq
import statistics
import math
import loc_strength as loc

app = Flask(__name__, static_folder='../frontend/static', template_folder='../frontend/templates/')

# shortest path finding using a* algorithm
def astar_pathfinding(start, end, obstacles, grid_size=10):
    def index_to_coords(index):
        return divmod(index, grid_size)

    def coords_to_index(x, y):
        return x * grid_size + y

    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])

    grid = [[0] * grid_size for _ in range(grid_size)]
    
    # Mark obstacles
    for obstacle in obstacles:
        x, y = index_to_coords(obstacle)
        grid[x][y] = -1  # Mark obstacle cells

    # Ensure start and end are not obstacles
    start_x, start_y = index_to_coords(start)
    end_x, end_y = index_to_coords(end)
    grid[start_x][start_y] = 0
    grid[end_x][end_y] = 0

    open_set = []
    heapq.heappush(open_set, (0, (start_x, start_y)))
    came_from = {}
    g_score = { (start_x, start_y): 0 }
    f_score = { (start_x, start_y): heuristic((start_x, start_y), (end_x, end_y)) }

    while open_set:
        _, current = heapq.heappop(open_set)
        if current == (end_x, end_y):
            path = []
            while current in came_from:
                path.append(coords_to_index(current[0], current[1]))
                current = came_from[current]
            path.append(coords_to_index(start_x, start_y))
            return path[::-1]

        x, y = current
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < grid_size and 0 <= ny < grid_size and grid[nx][ny] != -1:
                tentative_g_score = g_score[current] + 1
                if (nx, ny) not in g_score or tentative_g_score < g_score[(nx, ny)]:
                    came_from[(nx, ny)] = current
                    g_score[(nx, ny)] = tentative_g_score
                    f_score[(nx, ny)] = tentative_g_score + heuristic((nx, ny), (end_x, end_y))
                    if (nx, ny) not in [i[1] for i in open_set]:
                        heapq.heappush(open_set, (f_score[(nx, ny)], (nx, ny)))

    return []  # No path found

# rendering homepage...
@app.route('/')
def index():
    return render_template('index.html')

# same-floor navigation
@app.route('/same-floor-path', methods=['POST'])
def same_floor_path():
    data = request.json
    start = data.get('start')
    end = data.get('end')
    obstacles = data.get('obstacles', [])
    
    if start is None or end is None or start == end:
        return jsonify({'error': 'Invalid start or end position.'}), 400

    if start in obstacles or end in obstacles:
        return jsonify({'error': 'Start or end position cannot be an obstacle.'}), 400

    path = astar_pathfinding(start, end, obstacles)
    print(path)
    
    if not path:
        return jsonify({'error': 'No valid path found between start and end'}), 404

    # Return the shortest path and lift
    return jsonify({
        'ground': path, 
        'distance': len(path)
    })

# multi-floor navigation
@app.route('/multi-floor-path', methods=['POST'])
def multi_floor_path():
    data = request.json
    start = data.get('start')  # Start room index
    end = data.get('end')  # End room index
    lifts = data.get('lifts', [])  # List of lifts' indices
    stairs = data.get('stairs', [])  # List of lifts' indices
    obstacles = data.get('obstacles', [])  # List of obstacles
    
    if start is None or end is None:
        return jsonify({'error': 'Invalid positions.'}), 400

    best_path = None
    min_distance = float('inf')
    platform = ''

    min_distance_lift = float('inf')
    best_path_lift = None
    best_lift = None
    
    # Calculate path for each lift
    for lift_position in lifts:
        # Mark the current lift as a possible path and treat other lifts as obstacles
        obstacles_current_floor = obstacles.copy()
        obstacles_current_floor.remove(lift_position)  # Remove the current lift from obstacles
        
        # Pathfinding from start to lift
        path_to_lift = astar_pathfinding(start, lift_position, obstacles_current_floor)
        if not path_to_lift:
            continue  # Skip if no path from start to this lift
        
        # Pathfinding from lift to end (on the destination floor)
        obstacles_other_floor = obstacles.copy()  # Re-initialize obstacles for the end floor
        path_from_lift = astar_pathfinding(lift_position, end, obstacles_current_floor)
        if not path_from_lift:
            continue  # Skip if no path from lift to the end room
        
        # Calculate total distance for this lift
        total_distance = len(path_to_lift) + len(path_from_lift)

        # Check if this lift provides a shorter path
        if total_distance < min_distance_lift:
            min_distance_lift = total_distance
            best_path_lift = {'ground': path_to_lift, 'first': path_from_lift}
            best_lift = lift_position

    min_distance_stair = float('inf')
    best_path_stair = None
    best_stair = None

    for stair_position in stairs:
        # Mark the current lift as a possible path and treat other lifts as obstacles
        obstacles_current_floor = obstacles.copy()
        obstacles_current_floor.remove(stair_position)  # Remove the current lift from obstacles
        
        # Pathfinding from start to lift
        path_to_stair = astar_pathfinding(start, stair_position, obstacles_current_floor)
        if not path_to_stair:
            continue  # Skip if no path from start to this lift
        
        # Pathfinding from lift to end (on the destination floor)
        obstacles_other_floor = obstacles.copy()  # Re-initialize obstacles for the end floor
        path_from_stair = astar_pathfinding(stair_position, end, obstacles_current_floor)
        if not path_from_stair:
            continue  # Skip if no path from lift to the end room
        
        # Calculate total distance for this lift
        total_distance = len(path_to_stair) + len(path_from_stair)

        # Check if this lift provides a shorter path
        if total_distance < min_distance_stair:
            min_distance_stair = total_distance
            best_path_stair = {'ground': path_to_stair, 'first': path_from_stair}
            best_stair = stair_position

    # Checking the best path through lift and stairs. 
    if min_distance_lift < min_distance_stair:
        best_path = best_path_lift
        min_distance = min_distance_lift
        platform = 'lift'

    else:
        best_path = best_path_stair
        min_distance = min_distance_stair
        platform = 'stair'

    if best_path is None or platform == '':
        return jsonify({'error': 'No valid path found between start and end through lifts.'}), 404

    # Return the shortest path and lift
    return jsonify({
        'best_platform': platform,
        'shortest_path': best_path,
        'distance': min_distance,
        'ground': best_path['ground'], 
        'first': best_path['first']
    })


def get_floor(index,row,col,max_floor):
    ''' given an index and the dimensions of the grid, determines the floor the index is in
        max_floor is the total number of floors in the building, 0 refers to only ground floor.
    '''
#    only ground floor,
    if max_floor == 0:
        return 0
    
    dim = row*col
    floor = 0
    
    for i in range(1,max_floor):
        print(i*dim)
        if index<= i*dim:
            break   
        else:
            floor+=1

    if floor > max_floor:
        return "Invalid index"
            
    return floor

def get_one_best_pos(positions, r,c):
    ''' For a select list of cells on a rxc grid, find the (approximate centroid(goal) -> perfect pos) one average position.
    
    // to find centroid consider a square of length one around the point, and return highest freq point/s that the square covers.
    '''
    
    final_pos =[]
    for i in range(1,r):
        avg_val = 0
        count = 0
        scaled_i = i + r
        
        for val in positions:
            # if cells are part of the same row, get the integer average
            if math.ceil(val/c)==scaled_i:
                # debug 
                avg_val+=val
                count+=1
        
        if count>0:
            # ceiling value if the result contains floating point
            avg_val = math.ceil(avg_val/count)

            # append all avgerages
            final_pos.append(avg_val)
        
    # remove zeros from the resultant list
    final_pos = [num for num in final_pos if num!=0]
    
    # get the middle value from list of all the vertical cells(median only works for odd number of length)
    n = len(final_pos)
    n = math.ceil((n/2)-1)
    best_pos = 0 if n<0 else final_pos[n]
        
    
    return best_pos

def find_location(in_signal, grid_size = [10,10], signal_map = loc.cell_signal, ap_pos = loc.ap_pos):
    ''' Given the input strength signals for all 'n' access points in the format [AP1,AP2,AP3,AP4],
    function returns the cell number (on one-dim grid) a user is at currrently.
    '''
    m = len(signal_map)
    n = len(ap_pos)
    
    min_distance = float('inf')
    distance = defaultdict(int)
    best_pos = []
    
    for i in range(m):
        val = 0
        for j in range(n):  
            # val+= abs(float(in_signal[j]) - float(signal_map[i+1][j]))
            val+= abs(float(in_signal[j]) - signal_map[i+1][j])
    
        distance[i+1] = val
        
        # update min
        if min_distance > val:
            min_distance = val
            best_pos = [i+1]
        elif val == min_distance:
            best_pos.append(i+1)

    # if best pos > 1 then only return one value
    if len(best_pos) > 1:
        r = grid_size[0]
        c = grid_size[1]
        single_best_pos = get_one_best_pos(best_pos, r,c)
    else:
        single_best_pos = best_pos[0]

    return single_best_pos, get_floor(single_best_pos, grid_size[0], grid_size[1], 8)

# user input signal strength
@app.route('/submit-form', methods=['POST'])
def submit_form():
    # Get the data from the request
    data = request.json  # The data should be in JSON format

    # Extract the fields from the received data
    fields = data.get('fields', [])

    if len(fields) != len(loc.ap_pos):
        return jsonify({'error': 'Invalid data. Sixteen fields are required.'}), 400

    ind, floor = find_location(fields)
    print('index',ind, floor)

    # You can now process the data as needed
    # For example, return the data back as a confirmation
    return jsonify({
        'message': 'Data received successfully',
        'index': ind,
        'floor': floor
    })

if __name__ == '__main__':
    app.run(debug=True)
