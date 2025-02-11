# dimensions and floor levels
grid_size = 10

# 16 aps on floors 1,3,5,7, AP positioning
ap_positions = {
    1: (0, 2, 2),  2: (0, 2, 7),  3: (0, 7, 2),  4: (0, 7, 7),
    5: (2, 2, 2),  6: (2, 2, 7),  7: (2, 7, 2),  8: (2, 7, 7),
    9: (4, 2, 2), 10: (4, 2, 7), 11: (4, 7, 2), 12: (4, 7, 7),
    13: (6, 2, 2), 14: (6, 2, 7), 15: (6, 7, 2), 16: (6, 7, 7)
}

# simulating signals using Manhattan distance
def manhattan_distance(x1, y1, x2, y2):
    return abs(x1 - x2) + abs(y1 - y2)

# storing signal strength for all floors
cell_signal = {}

for floor in range(8):  # floors 0 to 7 (0-based index)
    filtered_indices = [i for i in range(floor * 100 + 11, (floor + 1) * 100, 2)]
    
    floor_signal = {}

    for index in filtered_indices:
        r, c = divmod(index % 100, grid_size)  # row, col from floor-local index
        floor_signal[index] = []

        for ap, (ap_floor, ap_r, ap_c) in ap_positions.items():
            dist = manhattan_distance(r, c, ap_r, ap_c)  #calc distance
            signal = max(100 - (dist * 5), 0)  # calc signal strength
            
            # signal from AP for each floor reduces by 10
            floor_diff = abs(floor - ap_floor)  
            signal = max(signal - (floor_diff * 10), 0)
            
            floor_signal[index].append(signal)
    
    cell_signal[floor] = floor_signal

# print results
# for floor in cell_signal:
#     print(f"Floor {floor}:")
#     for i in sorted(cell_signal[floor].keys()):
#         print(f"  Cell {i}: {cell_signal[floor][i]}")





