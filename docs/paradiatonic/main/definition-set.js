// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

const definitionSet = (() => {

    const keyboardLayoutSet = (() => {
        const standardA = 440;
        return {
            count: 7 * 5
        }
    })(); //keyboardLayoutSet

    const result = {
        keyboardLayoutSet: keyboardLayoutSet,
        keyboardOptions: {
            whiteKeyColor: "white",
            standardColorA: "Azure", // 440 Hz
            highlightColor: "Chartreuse",
            chordColor: "LemonChiffon",
            chordRootColor: "yellow",
        },
    }; //result

    return result;

})(); //definitionSet
