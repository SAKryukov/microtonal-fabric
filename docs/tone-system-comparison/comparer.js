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

const comparer = (function setupComparer() {

    const comparer = elements.controls.comparer;
    comparer.left = elements.controls.comparerLeft;
    comparer.right = elements.controls.comparerRight;
    comparer.left.direction = false;
    comparer.right.direction = true;
    comparer.left.comparer = comparer;
    comparer.right.comparer = comparer;
    comparer.chordSequence = null;

    comparer.makeSequence = function () {
        if (comparer.chordSequence) return comparer.chordSequence;
        comparer.chordSequence = [];
        for (let chordIndex in comparer.chordSet)
            if (comparer.chordSet[chordIndex].constructor != Number)
                comparer.chordSequence.push(comparer.chordSet[chordIndex]);
        return comparer.chordSequence;
    }; //comparer.makeSequence

    comparer.refresh = function (doEnable) {
        comparer.chordSequence = null;
        for (let half of [comparer.left, comparer.right]) {
            if (doEnable)
                half.style.fill = definitionSet.highlightComparer;
            else
                half.style.fill = definitionSet.highlightDefault;
        } //loop
    }; //comparer.refresh

    for (let half of [comparer.left, comparer.right]) {
        half.activate = function (element, ctrlKey, doActivate) {
            const comparer = element.comparer;
            const direction = element.direction;
            const chordSequence = comparer.makeSequence();
            if (chordSequence.length < 1) return;
            let chord = chordSequence[0];
            if (direction && chordSequence.length > 1)
                chord = chordSequence[1];
            chord.activate(chord, doActivate);
        } //half.activate
        half.onmouseenter = function (event) {
            if (event.buttons == 1)
                event.target.activate(event.target, event.ctrlKey, true);
            return false;
        }; //half.onmouseenter
        half.onmouseleave = function (event) {
            event.target.activate(event.target, event.ctrlKey, false);
            return false;
        }; //half.onmouseleave
        half.onmousedown = function (event) {
            if (event.button == 0)
                event.target.activate(event.target, event.ctrlKey, true);
            else
                event.target.activate(event.target, event.shiftKey, false);
            return false;
        }; //half.onmousedown
        half.onmouseup = function (event) {
            if (event.button == 0)
                event.target.activate(event.target, event.ctrlKey, false);
            return false;
        }; //half.onmouseup
    }; //half's event handlers

    (function setupKeyboard(){
        const arrow = {left: 37, right: 39 };
        const keyboardHandler = function(event, doActivate) {
            if (!event.ctrlKey) return;
            const keyCode = event.keyCode || event.which;
            if (keyCode == arrow.left)
                comparer.left.activate(comparer.left, true, doActivate);
            else if (keyCode == arrow.right)
                comparer.right.activate(comparer.right, true, doActivate);
        }; //keyboardHandler
        window.onkeydown = function(event) { keyboardHandler(event, true); };
        window.onkeyup = function(event) { keyboardHandler(event, false); };    
    })(); //setupKeyboard

    return comparer;

})();