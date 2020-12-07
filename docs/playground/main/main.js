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
        instrumentSelector: document.querySelector("#instrument"),
    }; //elements

    elements.keyboardParent.style.display = "grid"; // important workaround, otherwise initializationController.initialize breaks it
                                                    // by restoring previous display style
    initializationController.initialize(
        elements.initialization.hiddenControls,
        elements.initialization.startButton,
        elements.initialization.startButtonParent,
        start);

    function start() {

        const population = new UserPopulation(tones, definitionSet.rowCount, definitionSet.columnCount);

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

        keyboard.label((x, y) => population.labelHandler(x, y));
        keyboard.setTitles((x, y) => population.titleHandler(x, y));

        (function setupInstruments() {
            for (let instrumentData of instrumentList) {
                const option = document.createElement("option");
                option.textContent = instrumentData.header.instrumentName;
                elements.instrumentSelector.appendChild(option);
            } //loop
            elements.instrumentSelector.selectedIndex = 0;
            elements.instrumentSelector.onchange = event => instrument.data = instrumentList[event.target.selectedIndex];
        })(); //setupInstruments

    }; //start

}; //window.onload