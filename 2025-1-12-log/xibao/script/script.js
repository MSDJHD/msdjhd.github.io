function showMessage() {
    var message = document.getElementById("message");
    message.style.opacity = 1;
    message.style.transform = "translate(-50%, -50%)";
    message.style.pointerEvents = "auto";
}
function hideMessage() {
    var message = document.getElementById("message");
    message.style.opacity = 0;
    message.style.transform = "translate(-50%, 200%)";
    message.style.pointerEvents = "none";
}