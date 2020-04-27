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
        keyboard: document.querySelector("body main > svg"),
        keyArray: document.querySelectorAll("body main > svg rect"),
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

window.onload = () => {
    
    (function Initialize() {
        const initializerControls = findInitializerControls();
        initializerControls.initializerButton.focus();
        if (initializationController.badJavaScriptEngine()) return;
        initializationController.initialize(
            initializerControls.hidden,
            initializerControls.initializerButton,
            initializerControls.initializer,
            startApplication
        );    
    })(); //Initialize

    function startApplication() {

        const controls = findControls();

        let instrument;
        const playHandler = (index, on) => {
            instrument.play(on, index);
            //alert(index);
        }
        const keyboardProperties = setupKeyboard(controls, playHandler);
        // A: key 68, 110/220/440/880 Hz
        // F: 43.65353 ?
        // F: 87.30706 ?
        const fa = 800 * Math.pow(2, -68/29);
        instrument = new Instrument(keyboardProperties.first, keyboardProperties.last, fa, 29);
        
        instrument.data = instrumentList[0];
        for (let index in instrumentList) {
            const instrument = instrumentList[index];
            const option = document.createElement("option");
            if (index == 0) option.selected = true;
            option.textContent = instrument.header.instrumentName;
            controls.instrument.appendChild(option);
        } //loop
        controls.instrument.onchange = event => {
            instrument.data = instrumentList[event.target.selectedIndex];
        };

        setupKeyboard(controls, playHandler);

        controls.playControl.volume.onchange = (self, value) => instrument.volume = value;
        controls.playControl.sustain.onchange = (self, value) => instrument.sustain = value;
    
    } //startApplication

};
