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
    }
}

function changeState(robot_id, result) {
    document.getElementById(`${robot_id}-start`).disabled = false;
    document.getElementById(`${robot_id}-stop`).disabled = false;
    
    switch (result) {
        case "started":
            document.getElementById(`${robot_id}-state`).innerHTML = "Führt Aufgaben durch";
            document.getElementById(`${robot_id}-state`).style.color = "green";
            document.getElementById(`${robot_id}-start`).disabled = true;
            break;

         case "stopped":
            document.getElementById(`${robot_id}-state`).innerHTML = "Wartet auf Befehl";
            document.getElementById(`${robot_id}-state`).style = "black";
            document.getElementById(`${robot_id}-stop`).disabled = true;
            break;

        default:
            document.getElementById(`${robot_id}-state`).innerHTML = result;
            break;
    }
}
