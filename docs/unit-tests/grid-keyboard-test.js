window.onload = _ => {
    const parent = document.querySelector("body > section");
    const fitElement = document.querySelector("input");
    const keyboard = new GridKeyboard(parent, "5em", undefined, 7, 7*4,
    {
        background: "transparent",
        hightlight: "yellow",
        border: "black",
        label: "lightGray"
    });
    fitElement.onchange = event => keyboard.fitView = event.target.checked;
};
