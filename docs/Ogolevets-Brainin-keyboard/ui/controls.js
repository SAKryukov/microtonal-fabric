"use strict";

const findInitializerControls = () => {
    return {
        initializer: document.querySelector("body > aside"),
        initializerButton: document.querySelector("body > aside > button"),
        hidden: [
            document.querySelector("body main"),
            document.querySelector("body article"),
        ],
    };
}; //findInitializerControls

const findControls = () => {
    const indicatorWidth = "3em";
    const controls = {
        main: document.querySelector("body main"),
        keyboards: document.querySelectorAll("body main > svg"),
        playControl: {
            volumeLabel: document.querySelector("body article label:first-of-type"),
            volume: new Slider( { value: 1, min: 0, max: 1, step: 0.01, indicatorWidth: indicatorWidth }, document.querySelector("#slider-volume")),
            sustainLabel: document.querySelector("body article label:last-of-type"),
            sustain: new Slider( { value: 0, min: 0, max: 10, step: 0.1, indicatorWidth: indicatorWidth, indicatorSuffix: " s" }, document.querySelector("#slider-sustain")),
        },
        keyboardLayout: document.querySelector("#select-layout"),
        instrument: document.querySelector("#select-instrument"),
    };
    controls.playControl.volume.label = controls.playControl.volumeLabel;
    controls.playControl.sustain.label = controls.playControl.sustainLabel;
    return controls;
}; //findControls
