// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

const getControls = () => {
    
    const leftRightTime = document.getElementById("left-right-time");
    const leftRightKey = document.getElementById("left-right-key");
    const upDown = document.getElementById("up-down");
    
    return {
        sequence: document.querySelector("select"),
        shift: {
            time: {
                input: document.getElementById("input-time"),
                left: leftRightTime.firstElementChild,
                right: leftRightTime.lastElementChild,
            },
            key: {
                input: document.getElementById("input-key"),
                left: leftRightKey.firstElementChild,
                right: leftRightKey.lastElementChild,
            },
        },
        move: {
            up: upDown.firstElementChild,
            down: upDown.lastElementChild,
        },
        error: document.querySelector("footer i"),
        keyboard: {
            from: document.getElementById("button-from-keyboard"),
            appendFrom: document.getElementById("button-append-from-keyboard"),
            to: document.getElementById("button-to-keyboard"),
        },
    };

} //getControls
