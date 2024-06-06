//send command to robot
async function send_command(robot_id, command) {
    console.log(`Sending command ${command} to ${robot_id}`)

    const formData = new URLSearchParams();
    formData.append('command', command);

    try {
        const response = await fetch(`/control/${robot_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        });

        const result = await response.text();
        change_state(result);
    } catch (error) {
        console.log(error);
        document.getElementById('robot-status').innerText = 'Error: ' + error;
        document.getElementById('robot-status').style.color = "red";
    }
}

//Change status of robot by updating text
function change_state(result) {
    start_button = document.getElementById('start');
    stop_button = document.getElementById('stop');
    settings_button = document.getElementById('settings');
    display_status = document.getElementById('robot-status');

    switch (result) {
        case "started":
            display_status.innerHTML = "Führt Aufgaben durch"
            display_status.style.color = "green";
            stop_button.disabled = false;
            start_button.disabled = true;
            settings_button.disabled = false;
            break;

         case "stopped":
            display_status.innerHTML = "Angehalten, wartet auf Befehl";
            display_status.style = "black";
            stop_button.disabled = true;
            start_button.disabled = false;
            settings_button.disabled = false;
            break;

        case "already started":
            display_status.innerHTML = "Roboter läuft schon";
            display_status.style.color = "orange";
            stop_button.disabled = false;
            start_button.disabled = true;
            settings_button.disabled = false;
            break;

        case "not found":
            display_status.innerHTML = "Roboter ist nicht erreichbar";
            display_status.style.color = "red";
            stop_button.disabled = true;
            start_button.disabled = false;
            settings_button.disabled = true;
            break;

        default:
            display_status.innerHTML = result;
            break;
    }
}


//Check for state update and update text
async function check_update(robot_id) {
    try {
        const response = await fetch(`/status/${robot_id}`);
        const result = await response.json();
        change_state(result.message);

    } catch (error) {
        console.error('Error fetching status:', error);
    }
    check_path(robot_id)
}
