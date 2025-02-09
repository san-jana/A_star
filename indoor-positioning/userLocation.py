import statistics
import math
from collections import defaultdict
import wifiFingerprints as wf


def get_one_best_pos(positions, r,c):
    ''' For a select list of cells on a rxc grid, find the (approximate centroid(goal) -> perfect pos) one average position.
    
    // to find centrid consider a square of length one around the point, and return highest freq point/s that the square covers.
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
    best_pos = final_pos[n]
        
    
    return best_pos

def find_location(in_signal, signal_map, ap_pos, grid_size):
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
            val+= abs(in_signal[j]-signal_map[i+1][j])
            
        
        distance[i+1] = val
        
#         update min
        if min_distance > val:
            min_distance = val
            best_pos = [i+1]
        elif val == min_distance:
            best_pos.append(i+1)
            
#     if best pos > 1 then only return one value
    if len(best_pos) > 1:
        r = grid_size[0]
        c = grid_size[1]
        single_best_pos = get_one_best_pos(best_pos, r,c)
    else:
        single_best_pos = best_pos[0]
        
    return single_best_pos
    
if __name__ == "__main__":
    user_input = [40,40,2,2]
    grid_size = [5,5]

    result = find_location(user_input, wf.cell_signal, wf.ap_pos, grid_size)
    print(result)