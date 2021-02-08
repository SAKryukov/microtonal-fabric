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
    } //constructor
    createKeys(parentElement) {
        const result = [];
        for (let index = 0; index < 4; ++index) {
            const key = document.createElement("div");
            key.style.width = "100px";
            key.style.height = "100px";
            key.style.outline = "solid thin red";
            key.style.margin = "0";
            key.style.display = "inline-block";
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
    isKey(parentElement, keyElement) {
        return keyElement && keyElement.parentElement == parentElement;
    } //isKey
    get defaultChord() {}
    customKeyHandler(keyElement, keyData, on) {
        //console.log(keyData.index, on);
    } //customKeyHandler
} //class MinimalKeyboard

window.onload = () => {

    const parentElement = document.createElement("section");
    document.body.appendChild(parentElement);
    const myKeyboard = new MinimalKeyboard(parentElement, null);
    
} //window.onload