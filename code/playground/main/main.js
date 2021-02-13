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
    indicatorWidth: "3em",
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
            if (globalKeyTracker.isControlDown()) return false;
            return super.customKeyHandler(keyElement, keyData, on);
        } // return false to stop embedded handling
        resetAllModes() { } //SA??? 
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
            hiddenControls: document.querySelectorAll("main > section, header, main > article, main > details"),
        },
        keyboardParent: document.querySelector("header > section"),
        instrumentSelector: document.querySelector("#instrument"),
        recorder: {
            record: new TwoStateButton(document.querySelector("#recorder > section:first-of-type > button:first-of-type")),
            playSequence: document.querySelector("#recorder > section:first-of-type > button:last-of-type"),
            toClipboard: document.querySelector("#recorder > section:last-of-type > button:first-of-type"),
            fromClipboard: document.querySelector("#recorder > section:last-of-type > button:last-of-type"),
        },
        keyboardControl: {
            fit: new TwoStateButton(document.querySelector("#keyboard-control > button:first-child")),
            hightlight: new TwoStateButton(document.querySelector("#keyboard-control > button:nth-child(2)")),
            reset: document.querySelector("#keyboard-control > button:last-of-type"),
        },
        playControl: {
            volumeLabel: document.querySelector("#volume-control label"),
            volume: new Slider( { value: 0.4, min: 0, max: 1, step: 0.01, indicatorWidth: definitionSet.indicatorWidth },
                document.querySelector("#slider-volume")),
            sustainEnableButton: new TwoStateButton(document.querySelector("#sound-control button:first-of-type")),
            sustain: new Slider( { value: 0, min: 0, max: 10, step: 0.1, indicatorWidth: definitionSet.indicatorWidth, indicatorSuffix: " s" }, document.querySelector("#slider-sustain")),
            transpositionLabel: document.querySelector("#sound-control label:last-of-type"),
            transposition: new Slider( { value: 0, min: -100, max: 100, step: 1, indicatorWidth: definitionSet.indicatorWidth},
                document.querySelector("#slider-transposition")),
        },
        initialize: function () {
            this.recorder.record.isDown = false;
            this.playControl.sustainEnableButton.isDown = false;
        }
    }; //elements
    elements.initialize();

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
 
        const music = (() => {
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
            instrument.data = instrumentList[definitionSet.instrumentControl.defaultInstrument];
            keyboard.keyHandler = (on, index) => instrument.play(on, index);
            keyboard.recorder = new Recorder();
            elements.keyboardControl.fit.handler = value => keyboard.fitView = value;
            elements.keyboardControl.hightlight.handler = value => keyboard.useHighlight = value;
            elements.keyboardControl.reset.onclick = () => keyboard.resetAllModes();
            instrument.volume = elements.playControl.volume.value;
            elements.playControl.volume.onchange = (_, value) => instrument.volume = value;
            const getSustainValue = () =>
                elements.playControl.sustainEnableButton.isDown ? elements.playControl.sustain.value : 0;
            instrument.sustain = getSustainValue();
            elements.playControl.sustainEnableButton.handler = value => {
                elements.playControl.sustain.disabled = !value;
            }
            instrument.sustain = getSustainValue();
            elements.playControl.sustain.onchange = () => instrument.sustain = getSustainValue();
            return { keyboard: keyboard, instrument: instrument };
        })();

        recorderControl.init(
            music.keyboard.recorder,
            elements.recorder.record, elements.recorder.playSequence,
            elements.recorder.toClipboard, elements.recorder.fromClipboard,
            isPlaying => {
                music.keyboard.playSequence();
                if (isPlaying)
                    music.keyboard.stopAllSounds();
            });

        (function setupInstruments() {
            for (let instrumentData of instrumentList) {
                const option = document.createElement("option");
                option.textContent = instrumentData.header.instrumentName;
                elements.instrumentSelector.appendChild(option);
            } //loop
            elements.instrumentSelector.selectedIndex = definitionSet.instrumentControl.defaultInstrument;
            elements.instrumentSelector.onchange = event => music.instrument.data = instrumentList[event.target.selectedIndex];
        })(); //setupInstruments

    }; //start

}; //window.onload
