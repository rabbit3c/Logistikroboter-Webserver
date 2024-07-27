let c = document.getElementById("canvas");
let ctx = c.getContext("2d");		

let x_max = 700;
let y_max = 400;

// set size canvas
ctx.canvas.width = x_max; 
ctx.canvas.height = y_max;

// map
map = [
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]
];

let width = Math.ceil(Math.min(x_max / map[0].length, y_max / map.length)); // calculate width of one square

// draw a filled square
function fill_square(x1, y1){
	ctx.fillRect(x1, y1, width, width);
}

// draw a filled circle
function fill_circle(x, y, r){
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

// draw the map
function draw_map() {
    for (y in map) {
        for (x in map[y]) {
            if (map[y][x] == 0) {
                ctx.fillStyle = "#7B481C";
            }
            else {
                ctx.fillStyle = "gray";
            }

            fill_square(x * width, y * width);
        }
    }
}

// draw start square
function draw_start(position) {
    ctx.fillStyle = "green";
    fill_square(position[0] * width, position[1] * width);
}

// draw target square
function draw_target(position) {
    ctx.fillStyle = "red";
    fill_square(position[0] * width, position[1] * width);
}

// draw the robot
function draw_robot(position) {
    let r = width / 2

    ctx.fillStyle = "blue";
    fill_circle(position[0] * width + r , position[1] * width + r, r - 5)
}

// make a request to the robot to get the path and draw the path
async function check_path(robot_id) {
    try {
        const response = await fetch(`/path/${robot_id}`);
        const result = await response.json();
        if (result['status'] == 'success') {
            draw_map()
            draw_start(result['start'])
            draw_target(result['target'])
        }
    } catch (error) {
        draw_map()
        console.error('Error fetching status:', error);
    }
    check_position(robot_id)
}

// make a request to get the position of the robot and draw the robot on the map
async function check_position(robot_id) {
    try {
        const response = await fetch(`/position/${robot_id}`);
        const result = await response.json();
        if (result['status'] == 'success') {
            draw_robot(result['position'])
        }
    } catch (error) {
        console.error('Error fetching status:', error);
    }
}

draw_map()