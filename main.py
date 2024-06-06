from flask import Flask, render_template, request, jsonify
import requests


app = Flask(__name__, static_url_path='/static')


# define robots
robots = {
    'Logistikroboter': 'http://192.168.1.32:5000',
    'Platzhalter': 'http://192.168.1.32:5000'
}

robots_data = {}


@app.route('/')
def index():
    return render_template('index.html', robots = robots)


@app.route('/settings/<robot_id>')
def settings(robot_id):
    if robot_id in robots:
        robot_url = robots[robot_id]
        response = requests.get(robot_url + '/get_values')

        values = response.json()

        x_coordinate = values['x_coordinate']
        y_coordinate = values['y_coordinate']
        x_direction = values['x_direction']
        y_direction = values['y_direction']

        return render_template('settings.html', robot_id = robot_id, x_coordinate = x_coordinate, y_coordinate = y_coordinate, x_direction = x_direction, y_direction = y_direction)
    else:
        return 'Roboter nicht gefunden', 404
    

# Function that sends a command to a robot
@app.route('/control/<robot_id>', methods = ['POST'])
def control(robot_id):
    if robot_id in robots:
        robot_url = robots[robot_id]
        response = requests.post(robot_url + '/control', request.form)

        robots_data[robot_id]['status'] = response.text
        return response.text
    else:
        return 'Roboter nicht gefunden', 404
    

# Function that the robots can call to update their status
@app.route('/update/<robot_id>', methods = ['POST'])
def update(robot_id):
    if robot_id in robots:
        data = request.json

        if data is None:
            return jsonify({'message': 'No data provided'}), 400
        
        robots_data[robot_id]['status'] = request.json['status']
        return jsonify({'message': 'Updated status successfully'}), 200
    
    return jsonify({'message': 'Robot not found'}), 404


# Function that returns the status of a robot to the frontend
@app.route('/status/<robot_id>', methods=['GET'])
def status(robot_id):
    if robot_id in robots_data:
        status_message = robots_data[robot_id]['status']
        return jsonify({'message': status_message})
    else:
        init()
        return jsonify({'status': 'error', 'message': 'Robot not found'}), 404
    
    
# Function that sets the values of the robot like start_position and start_direction
@app.route('/set_values/<robot_id>', methods=['POST'])
def set_values(robot_id):
    if robot_id in robots:
        robot_url = robots[robot_id]
        response = requests.post(robot_url + '/set_values', request.form)

        return response.text
    else:
        return 'Roboter nicht gefunden', 404


def init():
    for robot_id in robots:
        robots_data[robot_id] = {'status': 'not found'}

    print('Hello')


if __name__ == '__main__':
    init()
    app.run(host='0.0.0.0', port=5001)

# Running on http://127.0.0.1:5001
