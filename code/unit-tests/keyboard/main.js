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
    #implementation = {};
    constructor(parentElement, metrics) {
        super(parentElement, metrics);
    } //constructor
    createKeys(parentElement) {
        const metrics = this.derivedClassConstructorArguments[0];
        while (parentElement.firstChild) parentElement.removeChild(parentElement.lastChild);
        const result = [];
        const count = this.constructor.getRandom(1, 50);
        for (let index = 0; index < count; ++index) {
            const key = document.createElement("div");
            key.style.width = metrics.keyWidth;
            key.style.height = metrics.keyWidth;
            key.style.outline = metrics.keyBorder;
            key.style.outlineOffset = metrics.keyOutlineOffset;
            key.style.padding = metrics.keyPadding;
            key.style.margin = metrics.keyMargin;
            key.style.backgroundColor = metrics.colors.normal;
            key.style.display = "inline-block";
            key.style.color = "transparent";
            key.textContent = index;
            result.push(key);
            parentElement.appendChild(key);
        }
        return result;
    } //createKeys
    createCustomKeyData(keyElement, index) {}
    highlightKey(keyElement, keyboardMode) {
        const metrics = this.derivedClassConstructorArguments[0];
        switch (keyboardMode) {
            case keyHightlight.normal: return keyElement.style.backgroundColor = metrics.colors.normal;
            case keyHightlight.down: return keyElement.style.backgroundColor = metrics.colors.down;
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
    const myKeyboard = new MinimalKeyboard(parentElement,
        { // metrics:
            keyWidth: "60px",
            keyBorder: "solid thin red",
            keyOutlineOffset: "0px",
            keyPadding: "0.2em",
            keyMargin: "0",
            colors: {
                normal: "lightYellow",
                down: "lightCyan",
            }
        });
    myKeyboard.recreate();
    document.querySelector("button").onclick = () => myKeyboard.recreate();
    
} //window.onload