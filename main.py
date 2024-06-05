from flask import Flask, render_template, request
import requests


app = Flask(__name__, static_url_path='/static')


# define robots
robots = {
    'Roboter 1': 'http://192.168.1.32:5000',
    'Roboter 2': 'http://192.168.1.32:5000'
}


@app.route("/")
def index():
    return render_template('index.html', robots = robots)


@app.route("/control/<robot_id>", methods = ["POST"])
def control(robot_id):
    if robot_id in robots:
        robot_url = robots[robot_id]
        response = requests.post(robot_url + '/control', request.form)
        return response.text
    else:
        return "Roboter nicht gefunden", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

# Running on http://127.0.0.1:5001
