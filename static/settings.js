async function open_settings(robot_id) {
    location.replace(`./settings/${robot_id}`)
}

//set values of robot
async function set_values(robot_id) {
    start_x_coordinate = document.getElementById("start-x-coordinate").value;
    start_y_coordinate = document.getElementById("start-y-coordinate").value;
    start_x_direction = document.getElementById("start-x-direction").value;
    start_y_direction = document.getElementById("start-y-direction").value;
    delivery_x_coordinate = document.getElementById("delivery-x-coordinate").value;
    delivery_y_coordinate = document.getElementById("delivery-y-coordinate").value;
    delivery_x_direction = document.getElementById("delivery-x-direction").value;
    delivery_y_direction = document.getElementById("delivery-y-direction").value;

    const formData = new URLSearchParams();
    formData.append('start_position', JSON.stringify([start_x_coordinate, start_y_coordinate]));
    formData.append('start_direction', JSON.stringify([start_x_direction, start_y_direction]));
    formData.append('delivery_position', JSON.stringify([delivery_x_coordinate, delivery_y_coordinate]));
    formData.append('delivery_direction', JSON.stringify([delivery_x_direction, delivery_y_direction]));

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
    }
}