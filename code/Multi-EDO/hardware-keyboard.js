// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard

"use strict";

const hardwareKeyboard = {
    rows: [
        [90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 16], // 16 is shift, it works, but if produces event.shiftKey == true 
        [65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 13],
        [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220],
        [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 61, 8]
    ],
    substitutions: { "59": 186 } // weird peculiarity of Mozilla SeaMonkey: the code for the key :/; (next to L)
};
