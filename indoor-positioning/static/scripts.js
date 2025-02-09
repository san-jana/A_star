// document.addEventListener("DOMContentLoaded", function() {
    const inputButton = document.getElementById("userInputButton");
    const inputForm = document.getElementById("inputForm");

    if (inputButton && inputForm) {  // Ensure elements exist before adding event listeners
        inputButton.addEventListener("click", function() {
            if (inputForm.style.display === "block") {
                inputForm.style.display = "none";
            } else {
                inputForm.style.display = "block";
            }
        });
    } else {
        console.error("Button or form not found in the DOM.");
    }
// });
