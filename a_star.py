import heapq

class Node:
    # g is the actual weight/dictance covered
    # h is the heuristic estimate
    def __init__(self,x,y, g=0,h=0):
        self.x =x
        self.y = y
        self.g = g
        self.h = h
        self.f = g+h
        self.prev = None
        
    def __lt__(self, other):
        #return whether current instance is less than the other node
        return self.f < other.f
    
def heuristic_manhattan(current_node, goal_node):
    return abs(current_node.x-goal_node.x)+abs(current_node.y-goal_node.y)


def get_neighbours(node):
    directions = [(0,1),(1,0),(-1,0),(0,-1)]
    neighbours = []
    for direction in directions:
        neighbours.append((node.x+direction[0],node.y+direction[1]))
    # add case only for enclosed grid - list out of index, compare with grid size 
    
    return neighbours
        
        
# start and goal args must not be of type Node
def a_star(start,goal):
    
    """
    Finds the shortest path from start to goal using the A* algorithm.

    Args:
        start (Node): The starting node.
        goal (Node): The goal node.
        grid (list): A 2D list representing the grid, where 0 represents a walkable cell and 1 represents an obstacle.

    Returns:
        list: A list of tuples representing the coordinates of the shortest path, or "No path found!" if no path exists.
    """
    
    start = Node(start)
    goal = Node(goal)
    
    unvisited = []
    visited = set() # quick membership check    
    
    # starting with the exploration of the start node, pushing it into the empty heap
    heapq.heappush(unvisited, start)
    
    # exploring all nodes from the unvisited list until empty
    while unvisited:
        
        # prioritizing the nodes to visit using a min heap, returns the node with min total cost(f(n))
        # prioritising based on function f(n) = (weigth/cost to node + heuristic), 
        # where heuristic could be any one of the estimated distances (euclidean, manhattan)
        current_node = heapq.heappop(unvisited)
        
            
        # upon reaching the goal node, retrace the path to the start node and return the path
        if((current_node.x, current_node.y) == (goal.x, goal.y)):
            # to store the shortest path to destination
            path=[]
            while current_node:
                print("current route",path)
                path.append((current_node.x, current_node.y))
                current_node = current_node.prev
            return path[::-1]
        
        
        visited.add((current_node.x,current_node.y))  
            
        # explore the current node -> get all its neighbours, the next node to explore
        neighbours = get_neighbours(current_node)
        
        # only explore the node if previously unvisited
        for neighbour in neighbours: 
            if neighbour in visited:
                continue
            
            # only add the neighbour to the unvisited list(to be explored) if greater than 0, 1s represent an obstacle, 
            # (only specific for a grid) and if the point falls within the constraints of the grid size 
            # if 0 <= neighbour[0] < len(grid) and 0 <= neighbour[1] < len(grid[0]) and grid[neighbour[0]][neighbour[1]] == 0:               
            
                # set all the attributes of the node
            neighbour = Node(neighbour[0],neighbour[1])                
            neighbour.g = current_node.g + 1  # substitute 1 with weights/cost to that node
            neighbour.h = heuristic_manhattan(neighbour,goal)
            neighbour.f = neighbour.g + neighbour.h
            neighbour.prev = current_node
                
                # add the node to be explored -> by pushing it into the unvisited min heap
            heapq.heappush(unvisited, neighbour)
        
    return "No path found!"
    
    