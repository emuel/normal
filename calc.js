const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
    button.addEventListener("click", e => {
        const value = e.target.innerText;
        if (value === "C") {
            display.innerText = "";
        } else if (value === "=") {
            display.innerText = eval(display.innerText);
        } else {
            display.innerText += value;
            console.log(display.innerText);
        }
    });
});
