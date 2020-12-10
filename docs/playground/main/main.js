"use strict";

const repeat = { repeatObject: true }; //used in user data file
let userDataFile = "user.data";
const definitionSet = {
    keyWidth: "4em",
    keyHeight: "4em",
    userError: {
        element: "p",
        messageBadFile: `User data file not found, not accessible, or invalid`,
        messageBadFileContent: `Lexical error in user data`,
        style: "padding: 1em; padding-top: 0.2em; font-size: 180%; font-family: sans-serif",
        format: function(message, file) {
            return `<${this.element} style="${this.style}">${message}<br/>File: &ldquo;${file}&rdquo;</${this.element}>`;
        },
        reportBadFile: function(file) { document.write(this.format(this.messageBadFile, file)); },
        reportBadFileContent: function(file) { document.write(this.format(this.messageBadFileContent, file)); },
    }, //user Error
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

(function addUserDataDynamically() {
    window.onerror = () => window.status = definitionSet.userError.message;
    const script = document.createElement("script");
    const searchUrl = window.location.search;
    const useDefault = (!searchUrl || searchUrl.length < 2 || searchUrl[0] != "?")
    if (!useDefault)
        userDataFile = searchUrl.slice(1);
    script.src = userDataFile;
    document.head.append(script);
})(); //addUserDataDynamically

window.onload = () => {

    if (window.status) {
        window.onerror = undefined;
        return definitionSet.userError.reportBadFileContent(userDataFile);
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

        if (!UserPopulation.validate())
            return definitionSet.userError.reportBadFile(userDataFile);
 
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
