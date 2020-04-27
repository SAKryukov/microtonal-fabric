"use strict";

const setupKeyboard = (controls, keyHandler) => {
    
    const keyMap = new Map();

    const keys = controls.keyArray;
    let parseKeyNumberSlice = undefined;
    const parseKeyNumber = id => {
        if (parseKeyNumberSlice == undefined) {
            let index = 0;
            while (parseKeyNumberSlice == undefined) {
                if (!isNaN(parseInt(id[index]))) break;
                ++index;
            } //loop
            parseKeyNumberSlice = index;
        } //if
        return parseInt(id.slice(parseKeyNumberSlice));
    } //parseKeyNumber

    for (let key of keys) {
        const index = parseKeyNumber(key.id);
        keyMap.set(key, index);
        key.onmousedown = event => keyHandler(keyMap.get(event.target), true);
        key.onmouseup = event => keyHandler(keyMap.get(event.target), false);
        key.onmouseenter = event => { if (event.buttons == 1) keyHandler(keyMap.get(event.target), true); }
        key.onmouseleave = event => keyHandler(keyMap.get(event.target), false);                
    } //loop
    
    return { first: 0, last: keys.length - 1 };

} //setupKeyboard