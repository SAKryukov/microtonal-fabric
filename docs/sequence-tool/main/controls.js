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
    
    const result = {
        product: document.querySelector("footer em"),
        sequence: document.querySelector("select"),
        shift: {
            time: {
                input: document.getElementById("input-time"),
                left: leftRightTime.firstElementChild,
                right: leftRightTime.lastElementChild,
                timeSet: document.getElementById("button-time-set"),
                tempoFactor: document.getElementById("button-tempo-factor"),
            },
            key: {
                input: document.getElementById("input-key"),
                left: leftRightKey.firstElementChild,
                right: leftRightKey.lastElementChild,
            },
        },
        mark: {
            input: document.getElementById("input-mark"),
            add: document.getElementById("button-mark"),
        },
        move: {
            up: upDown.firstElementChild,
            down: upDown.lastElementChild,
            sortByKey: document.getElementById("button-sort-by-key"),
            sortByUpDownKey: document.getElementById("button-sort-by-up-down-key"),       
        },
        error: document.querySelector("footer i"),
        keyboard: {
            from: document.getElementById("button-from-keyboard"),
            appendFrom: document.getElementById("button-append-from-keyboard"),
            to: document.getElementById("button-to-keyboard"),
        },
    };

    for (let index in result.move)
        result.move[index].disabled = true;
    return result;

} //getControls
