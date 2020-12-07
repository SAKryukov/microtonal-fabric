// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

class GridKeyboard {

    #implementation = { useKeyHightlight: true, rows: [], keyMap: new Map() };

    constructor(element, keyWidth, keyHeight, rowCount, rowWidth, keyColors) {
        if (!keyColors) keyColors = {
            background: "transparent",
            hightlight: "lightYellow",
            disabled: "darkGray",
            border: "black",
            label: undefined
        };
        this.#implementation.label = handler => {
            for (let [key, value] of this.#implementation.keyMap) {
                const result = handler(value.x, value.y);
                if (result == null) { // disabled key mechanism
                    value.keyIndex = null;
                    value.style.backgroundColor = keyColors.disabled;
                } else
                    key.textContent = result;
            } //loop
        }; //this.#implementation.label
        this.#implementation.labelRow = handler => {
            for (let index = 0; index < this.#implementation.rows[row].length; ++index) {
                const result = handler(index);
                if (result == null) { // disabled key mechanism
                    value.keyIndex = null;
                    value.style.backgroundColor = keyColors.disabled;
                } else
                    this.#implementation.rows[row][index].textContent = result;
            } //loop
        }; //this.#implementation.labelRow
        const parseSize = stringValue => {
            if (!stringValue) return { vale: undefined, unit: undefined };
            const size = (/([0-9]*\.?[0-9]*)([a-zA-Z]*)/).exec(stringValue);
            const sizeValue = parseFloat(size[size.length-2]);
            const sizeUnit = size[size.length-1];
            return { value: sizeValue, unit: sizeUnit };
        } //parseSize
        const keySize = (() => {
            return { width: parseSize(keyWidth), height: parseSize(keyHeight) };
        })();
        element.style.display = "grid";
        element.style.overflowX = "auto";
        element.style.width = "100%";
        const keyHandler = (target, on, isMove) => {
            if (isMove && (event.buttons != 1)) return;
            const keyData = this.#implementation.keyMap.get(target);
            if (keyData.keyIndex == null) return; // indicated disabled
            if (this.#implementation.useKeyHightlight)
                target.style.backgroundColor = on ? keyColors.hightlight : keyColors.background;
            if (this.#implementation.action)
                this.#implementation.action(on, keyData.keyIndex);
        }; //keyHandler
        const borderStyle = `solid ${keyColors.border} thin`;
        let keyIndex = 0;
        for (let yIndex = 0; yIndex < rowCount; ++yIndex) {
            this.#implementation.rows[yIndex] = [];
            for (let xIndex = 0; xIndex < rowWidth; ++xIndex) {
                const key = document.createElement("div");
                this.#implementation.rows[yIndex][xIndex] = key;
                key.style.borderRadius = "0px"; //SA???
                key.style.paddingLeft = "0.3em";
                key.style.paddingTop = "0.3em";
                key.style.overflow = "hidden";
                key.style.color = keyColors.label;
                key.style.backgroundColor = keyColors.background;
                key.style.height = keyHeight ? keyHeight : keyWidth;
                if (yIndex == 0)
                    key.style.borderTop = borderStyle;
                if (xIndex == 0)
                    key.style.borderLeft = borderStyle;
                key.style.borderBottom = borderStyle;
                key.style.borderRight = borderStyle;
                this.#implementation.keyMap.set(key, { x: xIndex, y: yIndex, keyIndex: keyIndex++ });
                key.onmousedown = event => keyHandler(event.target, true);
                key.onmouseup = event => keyHandler(event.target, false);
                key.onmouseenter = event => keyHandler(event.target, true, true);
                key.onmouseleave = event => keyHandler(event.target, false, true);
                element.appendChild(key);
            } //loop keys
        } //loop rows
        (() => { //events
            setMultiTouch(
                element,
                () => true,
                (aKey, _, on) => keyHandler(aKey, on)
            );
        })(); //events
        this.#implementation.defineGridTemplates = doFit => {
            const widthUnit = doFit ? "fr" : keySize.width.unit;
            const widthValue = doFit ? 1 : keySize.width.value;
            element.style.gridTemplateColumns = `repeat(${rowWidth}, ${widthValue}${widthUnit})`;
        }; //this.#implementation.defineGridTemplates
        this.#implementation.defineGridTemplates(false);
        let lastOffsetWidth = undefined;
        this.#implementation.fitView = value => {
            const fitWidth = element.offsetWidth / rowWidth;
            this.#implementation.defineGridTemplates(value);
            if (!(keySize.height.value && keySize.height.unit)) {
                const keyHeight = value ? `${fitWidth}px` : `${keySize.width.value}${keySize.width.unit}`;
                for (let key of this.#implementation.keyMap.keys())
                    key.style.height = keyHeight;
            }
        };
        return;
        const keyColor = keyColors.background;
        const keyColorHighlight = keyColors.hightlight;
        let doUseHightlight = true;
        this.getUseHighlight = () => doUseHightlight;
        this.setUseHighlight = (value) => doUseHightlight = value;
        for (let yIndex = 0; yIndex < rowCount; ++yIndex)
            for (let xIndex = 0; xIndex < rowWidth; ++xIndex) {
                const cell = document.createElement("div");
                cell.style.borderLeft
            }
        // const keyHandler = (target, on) => {
        //     const index = this.map.get(target);
        //     if (doUseHightlight)
        //         target.style.backgroundColor = on ? keyColorHighlight : keyColor;
        //     this.action(on, index);
        // }; //keyHandler
        // const upEventHandler = (event, isMove) => {
        //     if (isMove && event.buttons != 1) return;
        //     keyHandler(event.target, false);
        // }; //upEventHandler
        // const downEventHandler = event => {
        //     if (event.buttons != 1) return;
        //     keyHandler(event.target, true);
        // }; //downEventHandler
        this.action = undefined;
        this.map = new Map();
        const color = keyColors.border;
        const borderProperty = `solid 1px ${color}`;
        element.style.display = "grid";
        element.style.paddingBottom = "0.3em";
        this.number = number;
        this.element = element;
        this.keyHeight = undefined;
        this.keyWidth = undefined;
        element.style.overflowX = "auto";
        element.style.userSelect = "none";
        let upperCounter = -3;
        let lowCounter = -2;
        let counter;
        let upperLast, lowLast;
        const keyArray = [];
        for (let row = 0; row < 2; ++row)
            for (let x = 0; x < number; ++x) {
                const key = document.createElement("div");
                key.style.backgroundColor = keyColor;
                if (row == 0) {
                    upperCounter += 2;
                    counter = upperCounter;
                    upperLast = key;
                } else {
                    lowCounter += 2;
                    counter = lowCounter;
                    lowLast = key;
                } //if
                const dummy = row == 0 && x == 0;
                if (!dummy) {
                    key.style.gridColumn = "span 2";
                    key.style.borderLeft = borderProperty;
                    key.style.borderTop = borderProperty;
                    if (row == 1)
                        key.style.borderBottom = borderProperty;
                    key.textContent = counter.toString();
                } else {
                    key.style.gridColumn = "span 1";
                    key.style.backgroundColor = "transparent";
                }
                element.appendChild(key);
                key.style.color = keyColors.label;
                key.style.padding = "0.1em 0.3em";
                if (!dummy) {
                    keyArray[counter] = key;
                    key.onmousedown = downEventHandler;
                    key.onmouseup = upEventHandler;
                    key.onmouseenter = event => downEventHandler(event, true);
                    key.onmouseleave = event => upEventHandler(event, true);
                } //if not dummy
            } //loop
            setMultiTouch(
                element,
                aKey => this.map.has(aKey),
                (aKey, touchObject, on) => keyHandler(aKey, on)
            );
            upperLast.style.borderRight = borderProperty;
            lowLast.style.borderRight = borderProperty;
            for (let index in keyArray)
                this.map.set(keyArray[index], parseInt(index));
    } //constructor
  
    label(handler) { this.#implementation.label(handler); }
    labelRow(row, handler) { this.#implementation.labelRow(row, handler); }

    set fitView(booleanValue) { this.#implementation.fitView(booleanValue); }

    set keyHandler(handler) { 
        this.#implementation.action = handler; // handler(bool down, int keyIndex);
    } //keyHandler
    get action() { this.#implementation.action; }

    get useHighlight() { return this.#implementation.useKeyHightlight; }
    set useHighlight(value) { this.#implementation.useKeyHightlight = value; }

} //class GridKeyboard
