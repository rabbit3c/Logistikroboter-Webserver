let robot_index = 0;
let interval = null;


function update_robot_display() {
    const robot_ids = Object.keys(robots);
    const robot_id = robot_ids[robot_index];
    
    document.getElementById('robot-id').innerHTML = robot_id;
    document.getElementById('robot-status').innerHTML = ""; // Initialize or fetch the actual status
    document.getElementById('start').onclick = () => send_command(robot_id, 'start');
    document.getElementById('stop').onclick = () => send_command(robot_id, 'stop');
    document.getElementById('settings').onclick = () => open_settings(robot_id);

    check_update(robot_id)

    if (interval != null) {
        clearInterval(interval)

    }
    
    interval = setInterval(check_update, 3000, robot_id)
}

function next_robot() {
    const robot_ids = Object.keys(robots);
    robot_index = (robot_index + 1) % robot_ids.length;
    update_robot_display();
}

function previous_robot() {
    const robot_ids = Object.keys(robots);
    robot_index = (robot_index - 1 + robot_ids.length) % robot_ids.length;
    update_robot_display();
}

document.getElementById('next').onclick = next_robot;
document.getElementById('previous').onclick = previous_robot;
