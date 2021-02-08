// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

class MinimalKeyboard extends AbstractKeyboard {
    static getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    constructor(parentElement, recorder) {
        super(parentElement, recorder);
    } //constructor
    createKeys(parentElement) {
        while (parentElement.firstChild) parentElement.removeChild(parentElement.lastChild);
        const result = [];
        const count = this.constructor.getRandom(1, 50);
        for (let index = 0; index < count; ++index) {
            const key = document.createElement("div");
            key.style.width = "100px";
            key.style.height = "100px";
            key.style.outline = "solid thin red";
            key.style.outlineOffset = "0px";
            key.style.padding = "0.2em";
            key.style.margin = "0";
            key.style.display = "inline-block";
            key.style.color = "transparent";
            key.textContent = index;
            result.push(key);
            parentElement.appendChild(key);
        }
        return result;
    } //createKeys
    highlightKey(keyElement, keyboardMode) {
        switch (keyboardMode) {
            case keyHightlight.normal: return keyElement.style.backgroundColor = "transparent";
            case keyHightlight.down: return keyElement.style.backgroundColor = "lightBlue";
            case keyHightlight.chord: return keyElement.style.backgroundColor = "yellow";
            case keyHightlight.chordRoot: return keyElement.style.backgroundColor = "orange";
        } //switch
    } //highlightKey
    isTouchKey(parentElement, keyElement) {
        return keyElement && keyElement.parentElement == parentElement;
    } //isTouchKey
    get defaultChord() { return [1, 3, 5] }
    customKeyHandler(keyElement, keyData, on) {
        keyElement.style.color = on ? "black" : "transparent";
    } //customKeyHandler
} //class MinimalKeyboard

window.onload = () => {

    const parentElement = document.createElement("section");
    document.body.appendChild(parentElement);
    const myKeyboard = new MinimalKeyboard(parentElement, null);
    document.querySelector("button").onclick = () => myKeyboard.recreate();
    
} //window.onload