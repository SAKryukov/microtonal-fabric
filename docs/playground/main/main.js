window.onload = () => {

    const elements = {
        initialization: {
            startButton: document.querySelector("body > section > button"),
            startButtonParent: document.querySelector("body > section"),
            hiddenControls: document.querySelectorAll("main > section, header"),
        },
        keyboardParent: document.querySelector("header > section"),
    }; //elements

    elements.keyboardParent.style.display = "grid"; // important workaround, otherwise initializationController.initialize breaks it
                                                    // by restoring previous display style
    initializationController.initialize(
        elements.initialization.hiddenControls,
        elements.initialization.startButton,
        elements.initialization.startButtonParent,
        start);

    function start() {

        const keyboard = new GridKeyboard(elements.keyboardParent, "4em", "4em", 7, 7*4,
        {
            background: "transparent",
            hightlight: "yellow",
            border: "darkGray",
            label: "Gray"
        });
        keyboard.fitView = true;
        const frequencies = [];
        const startingFrequency = 10;
        for (index = 0; index < 4*7*7; ++index)
            frequencies.push(startingFrequency * Math.pow(2, index/12));
        const instrument = new Instrument(frequencies);
        instrument.volume = 0.2;
        instrument.data = instrumentList[0];
        keyboard.keyHandler = (on, index) =>
        {
             instrument.play(on, index);
        }

    }; //start

}; //window.onload