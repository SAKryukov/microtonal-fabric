"use strict";

const definitionSet = {
    keyWidth: "4em",
    keyHeight: "4em",
    rowCount: 8,
    columnCount: 7*4,
}; //definitionSet

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

        const keyboard = new GridKeyboard(elements.keyboardParent, definitionSet.keyWidth, definitionSet.keyHeight,
            definitionSet.rowCount, definitionSet.columnCount,
            {
                background: "transparent",
                hightlight: "yellow",
                border: "darkGray",
                disabled: "darkGray",
                label: "Gray"
            });
        keyboard.fitView = true;
        const frequencies = [];
        const startingFrequency = 10;
        for (let index = 0; index < definitionSet.columnCount * definitionSet.rowCount; ++index)
            frequencies.push(startingFrequency * Math.pow(2, index/12));
        const instrument = new Instrument(frequencies);
        instrument.volume = 0.2;
        instrument.data = instrumentList[0];
        keyboard.keyHandler = (on, index) =>
             instrument.play(on, index);

        const population = new UserPopulation(tones, definitionSet.rowCount, definitionSet.columnCount);
        keyboard.label((x, y) => population.labelHandler(x, y));

    }; //start

}; //window.onload