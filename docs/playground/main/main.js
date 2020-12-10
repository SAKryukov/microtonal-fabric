"use strict";

const repeat = { repeatObject: true }; //used in user data file
const userDataFile = "user.data";
const definitionSet = {
    keyWidth: "4em",
    keyHeight: "4em",
    userError: {
        element: "p",
        message: `Lexical error in user data, file: &ldquo;${userDataFile}&rdquo;`,
        style: "padding: 1em; padding-top: 0.2em; font-size: 180%; font-family: sans-serif",
    },
    colorSet: {
        background: "transparent",
        hightlight: "yellow",
        border: "darkGray",
        disabled: "darkGray",
        label: "Gray"
    },
    instrumentControl: {
        defaultInstrument: 0,
    },
}; //definitionSet

(function addUserDataDynamically(file) {
    window.onerror = () => window.status = definitionSet.userError.message;
    const script = document.createElement("script");
    const searchUrl = window.location.search;
    const useDefault = (!searchUrl || searchUrl.length < 2 || searchUrl[0] != "?")
    script.src = useDefault ? file : searchUrl.slice(1);
    document.head.append(script);
})(userDataFile); //addUserDataDynamically

window.onload = () => {

    if (window.status) {
        window.onerror = undefined;
        document.write(
            `<${definitionSet.userError.element} style="${definitionSet.userError.style}">${definitionSet.userError.message}</${definitionSet.userError.element}>`
        );
        return;
    } //if userError

    const elements = {
        initialization: {
            startButton: document.querySelector("body > section > button"),
            startButtonParent: document.querySelector("body > section"),
            hiddenControls: document.querySelectorAll("main > section, header"),
        },
        keyboardParent: document.querySelector("header > section"),
        instrumentSelector: document.querySelector("#instrument"),
    }; //elements

    setMetadata();

    elements.keyboardParent.style.display = "grid"; // important workaround, otherwise initializationController.initialize breaks it
                                                    // by restoring previous display style
    initializationController.initialize(
        elements.initialization.hiddenControls,
        elements.initialization.startButton,
        elements.initialization.startButtonParent,
        start);

    function start() {

        const instrument = (() => {
            const rowCount = tones.size.height;
            const columnCount = tones.size.width;
            let population = new UserPopulation(tones, rowCount, columnCount, repeat);
            const keyboard = new GridKeyboard(elements.keyboardParent, definitionSet.keyWidth, definitionSet.keyHeight,
                rowCount, columnCount, definitionSet.colorSet);
            keyboard.fitView = true;
            const instrument = new Instrument(population.frequencySet);      
            keyboard.label((x, y) => population.labelHandler(x, y));
            keyboard.setTitles((x, y) => population.titleHandler(x, y));
            population.cleanUp(); population = undefined;
            instrument.volume = 0.5;
            instrument.data = instrumentList[definitionSet.instrumentControl.defaultInstrument];
            keyboard.keyHandler = (on, index) => instrument.play(on, index);
            return instrument;
        })();

        (function setupInstruments() {
            for (let instrumentData of instrumentList) {
                const option = document.createElement("option");
                option.textContent = instrumentData.header.instrumentName;
                elements.instrumentSelector.appendChild(option);
            } //loop
            elements.instrumentSelector.selectedIndex = definitionSet.instrumentControl.defaultInstrument;
            elements.instrumentSelector.onchange = event => instrument.data = instrumentList[event.target.selectedIndex];
        })(); //setupInstruments

    }; //start

}; //window.onload
