from flask import Flask, request, jsonify, render_template
import heapq

app = Flask(__name__)

def astar_pathfinding(start, end, obstacles):
    def index_to_coords(index):
        return divmod(index, 10)

    def coords_to_index(x, y):
        return x * 10 + y

    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])

    grid = [[0] * 10 for _ in range(10)]
    for obstacle in obstacles:
        x, y = index_to_coords(obstacle)
        grid[x][y] = -1  # Mark obstacle cells

    start_x, start_y = index_to_coords(start)
    end_x, end_y = index_to_coords(end)

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
            if 0 <= nx < 10 and 0 <= ny < 10 and grid[nx][ny] != -1:
                tentative_g_score = g_score[current] + 1
                if (nx, ny) not in g_score or tentative_g_score < g_score[(nx, ny)]:
                    came_from[(nx, ny)] = current
                    g_score[(nx, ny)] = tentative_g_score
                    f_score[(nx, ny)] = tentative_g_score + heuristic((nx, ny), (end_x, end_y))
                    if (nx, ny) not in [i[1] for i in open_set]:
                        heapq.heappush(open_set, (f_score[(nx, ny)], (nx, ny)))

    return []  # No path found

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/path', methods=['POST'])
def path():
    data = request.json
    start = data['start']
    end = data['end']
    obstacles = data.get('obstacles', [])
    path = astar_pathfinding(start, end, obstacles)
    return jsonify(path)

if __name__ == '__main__':
    app.run(debug=True)
