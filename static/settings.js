async function open_settings(robot_id) {
    location.replace(`./settings/${robot_id}`)
}

//set values of robot
async function set_values(robot_id) {
    x_coordinate = document.getElementById("x-coordinate")
    y_coordinate = document.getElementById("y-coordinate")
    x_direction = document.getElementById("x-direction")
    y_direction = document.getElementById("y-direction")

    const formData = new URLSearchParams();
    formData.append('x_coordinate', x_coordinate.value);
    formData.append('y_coordinate', y_coordinate.value);
    formData.append('x_direction', x_direction.value);
    formData.append('y_direction',  y_direction.value);

    try {
        const response = await fetch(`/set_values/${robot_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        });

        const result = await response.text();

        if (result == "Saved values") {
            location.replace("../")
        }

    } catch (error) {
        console.log(error);
        document.getElementById(`${robot_id}-status`).innerText = 'Error: ' + error;
        document.getElementById(`${robot_id}-status`).style.color = "red";
    }
}