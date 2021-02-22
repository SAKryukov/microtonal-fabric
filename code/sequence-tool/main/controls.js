// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

const getControls = () => {
    
    const leftRightTime = document.getElementById("left-right-time");
    const leftRightKey = document.getElementById("left-right-key");
    const upDown = document.getElementById("up-down");
    
    const result = {
        metadata: document.querySelector("footer small"),
        error: document.querySelector("footer span"),
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
            addUp: document.getElementById("button-mark-up"),
            addDown: document.getElementById("button-mark-down"),
        },
        move: {
            up: upDown.firstElementChild,
            down: upDown.lastElementChild,
            sortByKey: document.getElementById("button-sort-by-key"),
            sortByUpDownKey: document.getElementById("button-sort-by-up-down-key"),       
        },
        advanced: {
            clone: document.querySelector("#advanced button:nth-of-type(1)"),
            remove: document.querySelector("#advanced button:nth-of-type(2)"),
            rhythmicPattern: document.querySelector("#input-rhythmic-pattern"),
            rhythmBeatTime: document.querySelector("#input-beat-time"),
            rhythmization: document.querySelector("#advanced button:nth-of-type(3)"),
            durationTime: document.querySelector("#input-duration"),
            durationTiming: document.querySelector("#select-duration"),
            durationAdjust: document.querySelector("#advanced button:nth-last-of-type(2)"),
            alignChords: document.querySelector("#advanced button:last-of-type"),
        },
        clipboard: {
            from: document.getElementById("button-from-keyboard"),
            appendFrom: document.getElementById("button-append-from-keyboard"),
            to: document.getElementById("button-to-keyboard"),
        },
    };

    for (let control of [result.move.sortByKey, result.move.sortByUpDownKey])
        control.style.display = "none";
    return result;

} //getControls
