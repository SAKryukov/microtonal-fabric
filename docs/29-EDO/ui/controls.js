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
            sustainLabel: document.querySelector("main article:first-child label:first-of-type"),
            sustain: new Slider( { value: 0, min: 0, max: 10, step: 0.1, indicatorWidth: indicatorWidth, indicatorSuffix: " s" }, document.querySelector("#slider-sustain")),
            transpositionLabel: document.querySelector("main article:first-child label:last-of-type"),
            transposition: new Slider( { value: 0, min: -100, max: 100, step: 1, indicatorWidth: indicatorWidth }, document.querySelector("#slider-transposition")),
            clearChord: document.querySelector("main button"),
        },
        keyboardLayout: document.querySelector("#select-layout"),
        instrument: document.querySelector("#select-instrument"),
        playMode: {
            normal: document.querySelector("#radio-mode-normal"),
            chord: document.querySelector("#radio-mode-chord"),
            chordSet: document.querySelector("#radio-mode-chord-set"),
        },
        version: document.querySelector("footer span"),
    };
    controls.playControl.volume.label = controls.playControl.volumeLabel;
    controls.playControl.sustain.label = controls.playControl.sustainLabel;
    controls.playControl.transposition.label = controls.playControl.transpositionLabel;
    controls.playControl.volumeLabel.ondblclick = _ => controls.playControl.volume.value = defaultVolume;
    controls.playControl.sustainLabel.ondblclick = _ => controls.playControl.sustain.value = defaultSustain;
    controls.playControl.transpositionLabel.ondblclick = _ => controls.playControl.transposition.value = defaultTransposition;
    return controls;
}; //findControls
