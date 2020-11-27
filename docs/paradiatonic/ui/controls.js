// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

const findInitializerControls = () => {
    return {
        initializer: document.querySelector("body > aside"),
        initializerButton: document.querySelector("body > aside > button"),
        hidden: [
            document.querySelector("body header"),
            document.querySelector("body main"),
            document.querySelector("footer"),
        ],
    };
}; //findInitializerControls

const findControls = () => {
    const indicatorWidth = "3em";
    const defaultVolume = 1;
    const defaultSustain = 0;
    const defaultTransposition = 0;
    const controls = {
        diagnostics:  document.querySelector("footer span:last-child"),
        keyboards: document.querySelectorAll("body header > svg"),
        playControl: {
            volumeLabel: document.querySelector("main article:last-of-type label"),
            volume: new Slider( { value: 1, min: 0, max: 10, step: 0.1, indicatorWidth: indicatorWidth }, document.querySelector("#slider-volume")),
            sustainEnableButton: new TwoStateButton(document.querySelector("main article:first-child button:first-of-type")),
            useHighlihgtKeysButton: new TwoStateButton(document.querySelector("#button-use-keys-highlight")),
            sustain: new Slider( { value: 0, min: 0, max: 10, step: 0.1, indicatorWidth: indicatorWidth, indicatorSuffix: " s" }, document.querySelector("#slider-sustain")),
            transpositionLabel: document.querySelector("main article:first-child label:last-of-type"),
            transposition: new Slider( { value: 0, min: -100, max: 100, step: 1, indicatorWidth: indicatorWidth }, document.querySelector("#slider-transposition")),
            clearChord: document.querySelector("#button-clear-chord"),
        },
        keyboardLayout: document.querySelector("#select-layout"),
        instrument: document.querySelector("#select-instrument"),
        playMode: {
            normal: document.querySelector("#radio-mode-normal"),
            chord: document.querySelector("#radio-mode-chord"),
            chordSet: document.querySelector("#radio-mode-chord-set"),
        },
        recorder: {
            record: new TwoStateButton(document.querySelector("#recorder button:first-of-type")),
            playSequence: document.querySelector("#recorder button:nth-of-type(2)"),
            toClipboard: document.querySelector("#recorder button:nth-of-type(3)"),
            fromClipboard: document.querySelector("#recorder button:nth-of-type(4)"),
        },
        version: document.querySelector("footer span"),
    };
    controls.playControl.volume.label = controls.playControl.volumeLabel;
    controls.playControl.sustain.label = controls.playControl.sustainLabel;
    controls.playControl.transposition.label = controls.playControl.transpositionLabel;
    controls.playControl.volumeLabel.ondblclick = _ => controls.playControl.volume.value = defaultVolume;
    controls.playControl.sustainEnableButton.isDown = false;
    controls.playControl.sustain.disabled = true;
    controls.playControl.transpositionLabel.ondblclick = _ => controls.playControl.transposition.value = defaultTransposition;
    controls.recorder.record.isDown = false;
    controls.recorder.playSequence.disabled = true;
    controls.recorder.toClipboard.disabled = true;
    return controls;
}; //findControls
