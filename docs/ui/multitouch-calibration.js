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
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard

"use strict";

const setupMultiTouchCalibration = (
    definitionSet,
    calibrationProbe,
    calibrationResult,
    buttonDone,
    calibrationDoneHandler) => {

    calibrationResult.style.color = definitionSet.options.touchValueColor;

    const eventAssigner = setMultiTouch();
    let force = 1;

    const touchHandler = (touch, isMove) => {
        calibrationResult.style.color = definitionSet.options.touchValueColorModified;
        const forceValue = eventAssigner.dynamicAlgorithm(touch, 1);
        if (isMove && forceValue < force) return;
        force = forceValue;
        calibrationResult.value = force.toPrecision(3);
    }; //touchHandler

    eventAssigner.assignTouchStart(calibrationProbe, (ev) => { touchHandler(ev.changedTouches[0], false); });
    eventAssigner.assignTouchMove(calibrationProbe, (ev) => { touchHandler(ev.changedTouches[0]), true; });

    buttonDone.onclick = () => {
        calibrationResult.style.color = definitionSet.options.touchValueColor;
        calibrationDoneHandler(force);
    }; //buttonDone.onclick

}; //setupMultiTouchCalibration