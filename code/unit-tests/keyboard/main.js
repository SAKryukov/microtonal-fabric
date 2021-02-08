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
    constructor(parentElement, recorder) {
        super(parentElement, recorder);
    }
    createKeys(parentElement) {
        const result = [];
        for (let index = 0; index < 4; ++index) {
            const key = document.createElement("div");
            key.style.width = "30px";
            key.style.height = "30px";
            key.style.border = "solid thin red";
            key.style.margin = "0";
            key.style.display = "inline-block";
            result.push(key);
            parentElement.appendChild(key);
        }
        return result;
    }
    highlightKey(element, keyboardMode) {
        switch (keyboardMode) {
            case keyHightlight.normal: return element.style.backgroundColor = "transparent";
            case keyHightlight.down: return element.style.backgroundColor = "lightBlue";
            case keyHightlight.chord: return element.style.backgroundColor = "yellow";
            case keyHightlight.chordRoot: return element.style.backgroundColor = "orange";
        }
    }
    isTouchElement(parentElement, element) { return false; }
} //class MinimalKeyboard


window.onload = () => {

    const parentElement = document.createElement("section");
    document.body.appendChild(parentElement);
    const myKeyboard = new MinimalKeyboard(parentElement, null);
    
} //window.onload