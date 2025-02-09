import userLocation
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/', methods = ['GET', 'POST'])
def index():
    print("Received request method:", request.method)  # Debugging line
    result = None
    showResult = False 
    
    if request.method == 'POST':
        try:
            ap1 = float(request.form['ap1'])
            ap2 = float(request.form['ap2'])
            ap3 = float(request.form['ap3'])
            ap4 = float(request.form['ap4'])
            result = userLocation.find_location([ap1,ap2,ap3,ap4],[5,5])
            # result = ap1+ap2+ap3+ap4
            showResult = True
        except ValueError:
            result = "Invalid input. Please enter numbers."
            showResult = True

    return render_template('index.html', result = result, showResult = showResult)

if __name__ == "__main__":
    app.run(debug=True,  host='0.0.0.0')