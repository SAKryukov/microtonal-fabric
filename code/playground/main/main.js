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

    if (window.status) {
        window.onerror = undefined;
        return definitionSet.userData.reportBadFileContent(definitionSet.userData.dataFileName);
    } //if userError

    if (initializationController.badJavaScriptEngine()) return;
    const elements = findElements();
    initializationController.initialize(
        elements.initialization.hiddenControls,
        elements.initialization.startButton,
        elements.initialization.startButtonParent,
        start);
    metadata.initialize(elements.copyright);

    function start() {

        if (tones.metadata) {
            metadataElement.initialize(tones.metadata);
            elements.keyboardControl.metadata.onclick = () => metadataElement.show();    
        } else
            elements.keyboardControl.metadata.style.display = "none";

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
            const keyboard = new PlaygroungKeyboard(elements.keyboardParent, definitionSet.keyWidth, definitionSet.keyHeight,
                rowCount, columnCount, definitionSet.colorSet);
            keyboard.fitView = true;
            const instrument = new Instrument(population.frequencySet, tones.transpositionUnits);
            keyboard.instrument = instrument;
            keyboard.label((x, y) => population.labelHandler(x, y));
            keyboard.setTitles((x, y) => population.titleHandler(x, y));
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
                if (!value) instrument.sustain = 0;
            } //elements.playControl.sustainEnableButton.handler
            instrument.sustain = getSustainValue();            
            const realisticTransposition = population.realisticTransposition;
            instrument.transposition = elements.playControl.transposition.value;
            if (realisticTransposition) {
                elements.playControl.transposition.minimum = realisticTransposition[0];
                elements.playControl.transposition.maximum = realisticTransposition[1];
                elements.playControl.transposition.onchange = (_, value) => {
                    instrument.transposition = value;
                    console.log(instrument.transposition);  
                } //elements.playControl.transposition.onchange
                elements.playControl.sustain.onchange = () => instrument.sustain = getSustainValue();    
            } else {
                elements.playControl.transposition.disabled = !tones.transpositionUnits;
                elements.playControl.transpositionLabel.disabled = !tones.transpositionUnits;    
                elements.playControl.transpositionLabel.style.color = 
                    elements.playControl.transpositionLabel.dataset.disabledColor;
            } //if
            population.cleanUp(); population = undefined;
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
