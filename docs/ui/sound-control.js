// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2019
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard"use strict";

const soundControlSet = (function setSoundControl() {

    const soundControlSet = {
        volume: 1,
        transposition: 0,
        preset: definitionSet.options.presets[definitionSet.options.defaultPreset].preset,
        dummy: 0
    } //soundControlSet

    for (let preset of definitionSet.options.presets) {
        const option = document.createElement("option");
        option.innerHTML = preset.title;
        definitionSet.elements.controls.instrument.appendChild(option);    
    } //loop presets
    definitionSet.elements.controls.instrument.onchange = function(event) {
        soundControlSet.preset = definitionSet.options.presets[event.target.selectedIndex].preset;
    }; //definitionSet.elements.controls.instrument.onclick
    definitionSet.elements.controls.instrument.selectedIndex = definitionSet.defaultPreset;

    definitionSet.elements.controls.volume.min = definitionSet.minVolume;
    definitionSet.elements.controls.volume.max = definitionSet.maxVolume;
    definitionSet.elements.controls.volume.step = definitionSet.volumeStep;
    definitionSet.elements.controls.volume.oninput = function(event) {
        soundControlSet.volume = parseFloat(event.target.value);
        definitionSet.elements.controls.volumeIndicator.innerHTML = event.target.value;
    }; //definitionSet.elements.controls.volume.oninput

    definitionSet.elements.controls.transposition.min = definitionSet.minTransposition;
    definitionSet.elements.controls.transposition.max = definitionSet.maxTransposition;
    definitionSet.elements.controls.transposition.step = definitionSet.transpositionStep;
    definitionSet.elements.controls.transposition.oninput = function(event) {
        soundControlSet.transposition = parseFloat(event.target.value);
        definitionSet.elements.controls.transpositionIndicator.innerHTML = event.target.value;
    }; //definitionSet.elements.controls.transposition.oninput

    const reset = function() {
        definitionSet.elements.controls.instrument.selectedIndex = definitionSet.defaultPreset;
        definitionSet.elements.controls.volume.value = definitionSet.initialVolume;
        definitionSet.elements.controls.transposition.value = 0;
        definitionSet.elements.controls.volume.oninput({target: definitionSet.elements.controls.volume});
        definitionSet.elements.controls.transposition.oninput({target: definitionSet.elements.controls.transposition});
        if (!definitionSet.elements.controls.touch) return;
        definitionSet.elements.controls.touch.checkboxUseTouchDynamics.checked = true;
        definitionSet.elements.controls.touch.calibrationResult.value = definitionSet.initialTouchDynamicsDivider;
    } //reset
    reset();

    definitionSet.elements.controls.reset.onclick = reset;

    return soundControlSet;

})();
