from flask import Flask, render_template, request
import requests


app = Flask(__name__)


# define robots
robots = {
    'robot1': 'http://192.168.1.32:5000'
}


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/control", methods = ["POST"])
def control():
    action = request.form['action']
    robot_url = robots['robot1']
    response = requests.post(robot_url + '/control', data={'action': action})
    return response.text


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

# Running on http://127.0.0.1:5001
