async function sendCommand(robot_id, command) {
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
        changeState(robot_id, result);
    } catch (error) {
        console.log(error);
        document.getElementById(`${robot_id}-state`).innerText = 'Error: ' + error;
        document.getElementById(`${robot_id}-state`).style.color = "red";
    }
}

function changeState(robot_id, result) {
    start_button = document.getElementById(`${robot_id}-start`);
    stop_button = document.getElementById(`${robot_id}-stop`);
    display_state = document.getElementById(`${robot_id}-state`);

    start_button.disabled = false;
    stop_button.disabled = false;
    
    switch (result) {
        case "started":
            changeStateStarted(robot_id)
            break;

         case "stopped":
            display_state.innerHTML = "Angehalten, wartet auf Befehl";
            display_state.style = "black";
            stop_button.disabled = true;
            break;

        case "already started":
            display_state.innerHTML = "Roboter läuft schon";
            display_state.style.color = "orange";
            setTimeout(changeStateStarted, 2000, robot_id)
            break;

        default:
            display_state.innerHTML = result;
            break;
    }
}

function changeStateStarted(robot_id) {
    document.getElementById(`${robot_id}-start`).disabled = true;
    document.getElementById(`${robot_id}-stop`).disabled = false;

    display_state = document.getElementById(`${robot_id}-state`);
    display_state.innerHTML = "Führt Aufgaben durch"
    display_state.style.color = "green";
}
