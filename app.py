from flask import Flask, request, jsonify
from a_star import a_star, Node  # Import your A* implementation

app = Flask(__name__)

@app.route('/run_astar', methods=['POST'])
def run_astar():
    data = request.json

    start_x, start_y = data['start']
    goal_x, goal_y = data['goal']

    start_node = Node(start_x, start_y)
    goal_node = Node(goal_x, goal_y)

    # Run A* algorithm
    path = a_star(start_node, goal_node)

    return jsonify({'path': path})

if __name__ == '__main__':
    app.run(debug=True)
