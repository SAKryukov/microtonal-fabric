// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

const repeat = { repeatObject: true }; //used in user data file
const definitionSet = {
    keyWidth: "4em",
    keyHeight: "4em",
    userData: {
        dataFileName: "user.data",
        error: {
            messageElement: "p",
            messageBadFile: "User data file not found or not accessible",
            messageBadFileContent: "Lexical error in user data",
            messageFileContentError: "Error in user data file: ",
            messageStyle: "padding: 1em; padding-top: 0.2em; font-size: 180%; font-family: sans-serif",
            messageFile: file => `<br/>File: &ldquo;${file}&rdquo;`,
            format: function(message, file) {
                return `<${this.messageElement} style="${this.messageStyle}">${message}${this.messageFile(file)}</${this.messageElement}>`; },
        }, //error
        reportBadFile: function(file) { document.write(this.error.format(this.error.messageBadFile, file)); },
        reportBadFileContent: function(file) { document.write(this.error.format(this.error.messageBadFileContent, file)); },
        reportBadFileContentBecause: function(file, reason) {
            document.write(this.error.format(this.error.messageFileContentError + reason, file));
        },
    }, //user Error
    colorSet: {
        background: "transparent",
        highlight: "yellow",
        border: "darkGray",
        disabled: "darkGray",
        label: "Gray"
    },
    instrumentControl: {
        defaultInstrument: 0,
    },
}; //definitionSet

(function addUserDataDynamically() {
    window.onerror = () => window.status = definitionSet.userData.error.messageBadFileContent;
    const script = document.createElement("script");
    const searchUrl = window.location.search;
    const useDefault = (!searchUrl || searchUrl.length < 2 || searchUrl[0] != "?")
    if (!useDefault)
        definitionSet.userData.dataFileName = searchUrl.slice(1);
    script.src = definitionSet.userData.dataFileName;
    document.head.append(script);
})(); //addUserDataDynamically

window.onload = () => {

    globalKeyTracker.init();

    class SpecialKeyboard extends GridKeyboard {
        constructor(element, keyWidth, keyHeight, rowCount, rowWidth, keyColors) {
            super(element, keyWidth, keyHeight, rowCount, rowWidth, keyColors);
        }
        customKeyHandler(keyElement, keyData, on) {
            if (globalKeyTracker.isAltDown()) return false;
            return super.customKeyHandler(keyElement, keyData, on);
        } // return false to stop embedded handling    
    } //class SpecialKeyboard

    if (window.status) {
        window.onerror = undefined;
        return definitionSet.userData.reportBadFileContent(definitionSet.userData.dataFileName);
    } //if userError

    if (initializationController.badJavaScriptEngine()) return;
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

        const validationResult = UserPopulation.validate();
        if (validationResult !== true) {
            if (validationResult === undefined)
                return definitionSet.userData.reportBadFile(definitionSet.userData.dataFileName);
            else
                return definitionSet.userData.reportBadFileContentBecause(definitionSet.userData.dataFileName, validationResult);
        } //if validationResult !== true
 
        const instrument = (() => {
            const rowCount = tones.size.height;
            const columnCount = tones.size.width;
            let population = new UserPopulation(tones, rowCount, columnCount, repeat);
            const keyboard = new SpecialKeyboard(elements.keyboardParent, definitionSet.keyWidth, definitionSet.keyHeight,
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
