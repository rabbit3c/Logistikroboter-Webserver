from flask import Flask, render_template, request, jsonify
import requests


app = Flask(__name__, static_url_path='/static')


# define robots
robots = {
    'Logistikroboter': 'http://192.168.1.32:5000',
    'Platzhalter': 'http://192.168.1.32:5000'
}

robots_data = {}


# render main page
@app.route('/')
def index():
    return render_template('index.html', robots = robots)


# render settings page including sending a request to get start and delivery values from robot
@app.route('/settings/<robot_id>')
def settings(robot_id):
    if robot_id in robots:
        robot_url = robots[robot_id]
        response = requests.get(robot_url + '/get_values')

        values = response.json()

        start_position = values['start_position']
        delivery_position = values['delivery_position']
        start_direction = values['start_direction']
        delivery_direction = values['delivery_direction']

        return render_template('settings.html', robot_id = robot_id, start_position = start_position, delivery_position = delivery_position, start_direction = start_direction, delivery_direction = delivery_direction)
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
@app.route('/update_status/<robot_id>', methods = ['POST'])
def update_status(robot_id):
    if robot_id in robots:
        data = request.json

        if data is None:
            return jsonify({'message': 'No position provided'}), 400
        
        robots_data[robot_id]['status'] = request.json['status']
        return jsonify({'message': 'Updated status successfully'}), 200
    
    return jsonify({'message': 'Robot not found'}), 404


# Function that the robots can call to update their position
@app.route('/update_position/<robot_id>', methods = ['POST'])
def update_position(robot_id):
    if robot_id in robots:
        data = request.json

        if data is None:
            return jsonify({'message': 'No data provided'}), 400
        
        robots_data[robot_id]['position'] = request.json['position']
        return jsonify({'message': 'Updated position successfully'}), 200
    
    return jsonify({'message': 'Robot not found'}), 404


# Function that the robots can call to update their path
@app.route('/update_path/<robot_id>', methods = ['POST'])
def update_path(robot_id):
    if robot_id in robots:
        data = request.json

        if data is None:
            return jsonify({'message': 'No data provided'}), 400
        
        robots_data[robot_id]['start'] = request.json['start']
        robots_data[robot_id]['target'] = request.json['target']

        return jsonify({'message': 'Updated path successfully'}), 200
    
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
    

# Function that returns the position of a robot to the frontend
@app.route('/position/<robot_id>', methods=['GET'])
def position(robot_id):
    if robot_id in robots_data:
        position = None

        if 'position' in robots_data[robot_id]:
            position = robots_data[robot_id]['position']

        if position is not None:
            return jsonify({'status': 'success', 'position': position})
        
        return {'status': 'error'}
    else:
        return jsonify({'status': 'error', 'message': 'Robot not found'}), 404


# Function that returns the path of a robot to the frontend
@app.route('/path/<robot_id>', methods=['GET'])
def path(robot_id):
    if robot_id in robots_data:
        start = None
        target = None

        if 'start' in robots_data[robot_id]:
            start = robots_data[robot_id]['start']

        if 'target' in robots_data[robot_id]:
            target = robots_data[robot_id]['target']

        if start is not None and target is not None:
            return jsonify({'status': 'success', 'start': start, 'target': target})
        
        return {'status': 'error'}
    else:
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


# Initialize robots
def init():
    for robot_id in robots:
        robots_data[robot_id] = {'status': 'not found'}

    print('Hello')


if __name__ == '__main__':
    init()
    app.run(host='0.0.0.0', port=5001)

# Running on http://127.0.0.1:5001
