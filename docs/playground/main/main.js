window.onload = () => {

    const elements = {
        initialization: {
            startButton: document.querySelector("body > section > button"),
            startButtonParent: document.querySelector("body > section"),
            hiddenControls: document.querySelectorAll("main > section, header"),
        },
        keyboardParent: document.querySelector("header"),
    }; //elements

    elements.keyboardParent.style.display = "grid"; // important fix, otherwise initializationController.initialize breaks it by restoring

    initializationController.initialize(
        elements.initialization.hiddenControls,
        elements.initialization.startButton,
        elements.initialization.startButtonParent,
        start);

    function start() {

        const keyboard = new GridKeyboard(elements.keyboardParent, "4em", undefined, 7, 7*4,
        {
            background: "transparent",
            hightlight: "yellow",
            border: "darkGray",
            label: "Grey"
        });

    }; //start

}; //window.onload