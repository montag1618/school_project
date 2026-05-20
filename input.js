let upPressed, downPressed, leftPressed, rightPressed;
upPressed = downPressed = leftPressed = rightPressed = false;

document.addEventListener("keydown", function(event) {
    let key = event.code;
    switch (key) {
        case "ArrowUp" : upPressed = true; break;
        case "ArrowDown" : downPressed = true; break;
        case "ArrowLeft" : leftPressed = true; break;
        case "ArrowRight" : rightPressed = true; break;
    };
});

document.addEventListener("keyup", function(event) {
    let key = event.code;
    switch (key) {
        case "ArrowUp" : upPressed = false; break;
        case "ArrowDown" : downPressed = false; break;
        case "ArrowLeft" : leftPressed = false; break;
        case "ArrowRight" : rightPressed = false; break;
    };
});

export {upPressed, downPressed, leftPressed, rightPressed};