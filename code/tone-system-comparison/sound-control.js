// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

const setSoundControl = (elements, definitionSet, volumeHandler, transpositionHander) => {

    const soundControlSet = { // common interface for different applications
        volume: 1,
        transposition: 0,
    } //soundControlSet

    elements.controls.volume.min = definitionSet.minVolume;
    elements.controls.volume.max = definitionSet.maxVolume;
    elements.controls.volume.step = definitionSet.volumeStep;
    elements.controls.volume.oninput = function(event) {
        soundControlSet.volume = parseFloat(event.target.value);
        elements.controls.volumeIndicator.innerHTML = event.target.value;
        if (volumeHandler) volumeHandler(soundControlSet.volume);
    }; //elements.controls.volume.oninput

    elements.controls.transposition.min = definitionSet.minTransposition;
    elements.controls.transposition.max = definitionSet.maxTransposition;
    elements.controls.transposition.step = definitionSet.transpositionStep;
    elements.controls.transposition.oninput = function(event) {
        soundControlSet.transposition = parseFloat(event.target.value);
        elements.controls.transpositionIndicator.innerHTML = event.target.value;
        if (transpositionHander) transpositionHander(soundControlSet.transposition);
    }; //elements.controls.transposition.oninput

    const reset = function() {
        elements.controls.volume.value = definitionSet.initialVolume;
        elements.controls.transposition.value = 0;
        elements.controls.volume.oninput({target: elements.controls.volume});
        elements.controls.transposition.oninput({target: elements.controls.transposition});
        if (!elements.controls.touch) return;
        elements.controls.touch.checkboxUseTouchDynamics.checked = true;
        elements.controls.touch.calibrationResult.value = definitionSet.initialTouchDynamicsDivider;
    } //reset
    reset();

    elements.controls.reset.onclick = reset;

    return soundControlSet;

}; //setSoundControl
