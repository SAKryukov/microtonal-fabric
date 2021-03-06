window.onload = _ => {
    const parent = document.querySelector("body > header");
    const fitElement = document.querySelector("input");
    const keyboard = new GridKeyboard(parent, "5em", undefined, 7, 7*4,
        {
            background: "transparent",
            hightlight: "yellow",
            border: "darkGray",
            label: "Grey"
        }
    );
    setTimeout(() => {
        keyboard.label((x, y) => 
        (x + y) % 2 ? "a" : "B"
        );
        keyboard.labelRow(1, index =>
            `x: ${index}`
        );
    });

    fitElement.onchange = event => keyboard.fitView = event.target.checked;

};
