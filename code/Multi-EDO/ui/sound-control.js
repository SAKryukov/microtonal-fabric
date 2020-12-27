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

"use strict";

const setSoundControl = (elements, commonSettings, volumeHandler, transpositionHandler) => {

    const soundControlSet = {
        volume: 1,
        transposition: 0,
        dummy: 0
    } //soundControlSet

    elements.controls.volume.min = commonSettings.minVolume;
    elements.controls.volume.max = commonSettings.maxVolume;
    elements.controls.volume.step = commonSettings.volumeStep;
    elements.controls.volume.oninput = function(event) {
        soundControlSet.volume = parseFloat(event.target.value);
        elements.controls.volumeIndicator.innerHTML = event.target.value;
        if (volumeHandler)
            volumeHandler(soundControlSet.volume);
    }; //elements.controls.volume.oninput

    elements.controls.transposition.min = commonSettings.minTransposition;
    elements.controls.transposition.max = commonSettings.maxTransposition;
    elements.controls.transposition.step = commonSettings.transpositionStep;
    elements.controls.transposition.oninput = function(event) {
        soundControlSet.transposition = parseFloat(event.target.value);
        elements.controls.transpositionIndicator.innerHTML = event.target.value;
        if (transpositionHandler)
            transpositionHandler(soundControlSet.transposition);
    }; //elements.controls.transposition.oninput

    const reset = function() {
        elements.controls.volume.value = commonSettings.initialVolume;
        elements.controls.transposition.value = 0;
        elements.controls.volume.oninput({target: elements.controls.volume});
        elements.controls.transposition.oninput({target: elements.controls.transposition});
        if (!elements.controls.touch) return;
        elements.controls.touch.checkboxUseTouchDynamics.checked = false;
        elements.controls.touch.calibrationResult.value = commonSettings.initialTouchDynamicsDivider;
    } //reset
    reset();

    elements.controls.reset.onclick = reset;

    return soundControlSet;

}; //setSoundControl
