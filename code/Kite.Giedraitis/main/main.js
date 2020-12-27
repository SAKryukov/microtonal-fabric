// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard

window.onload = () => {

    if (initializationController.badJavaScriptEngine()) return;

    const elements = {
        startButton: document.querySelector("body > section > button"),
        startButtonParent: document.querySelector("body > section"),
        hiddenControls: document.querySelectorAll("main > section"),
        keyboardLeft: new Keyboard(document.querySelector("body > header")),
        keyboardRight: new Keyboard(document.querySelector("body > header")),
        labelType: {
            intervals: document.querySelector("#label-type-intervals"),
            noteNames: document.querySelector("#label-type-note-names"),
            none: document.querySelector("#label-type-none"),
        },
        chromaticPathVisibility: document.querySelector("#chromatic-path-visibility"),
        useKeyboardHightlight: document.querySelector("#use-keyboard-highlight"),
    };

    initializationController.initialize(
        elements.hiddenControls,
        elements.startButton,
        elements.startButtonParent,
        start
    );

    (function setVisualClueVisibility() {
        elements.labelType.intervals.onchange = event => {
            if (event.target.checked) elements.keyboardLeft.labelVisibility = Keyboard.labelType.intervals;
        };
        elements.labelType.noteNames.onchange = event => {
            if (event.target.checked) elements.keyboardLeft.labelVisibility = Keyboard.labelType.noteNames;
        };
        elements.labelType.none.onchange = event => {
            if (event.target.checked) elements.keyboardLeft.labelVisibility = Keyboard.labelType.none;
        };
        elements.chromaticPathVisibility.onchange = event =>
            elements.keyboardLeft.chromaticPathVisibility = event.target.checked;
        elements.labelType.intervals.checked = true;
        elements.useKeyboardHightlight.onchange = event =>
            elements.keyboardLeft.useHighlight = event.target.checked;
        elements.useKeyboardHightlight.checked = true;
    })(); //setVisualClueVisibility

    function start() {
        const frequencies = [];
        const frequencyA = 440;
        const frequencyC = frequencyA * 3 / 5;
        for (let frequency of elements.keyboardLeft.instrumentFrequencySet)
            frequencies.push(frequency * frequencyC);
        const instrument = new Instrument(frequencies);
        instrument.volume = 0.2;
        instrument.data = instrumentList[0];
        for (kbd of [elements.keyboardLeft, elements.keyboardRight])
            kbd.keyHandler = (on, index) => instrument.play(on, index);
    } //start

}; //window.onload