// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

class ScrollableKeyboard {

    constructor(element, keyWidth, keyHeight, number, keyColors) {
        if (!keyColors) keyColors = {
            background: undefined,
            hightlight: undefined,
            border: undefined,
            label: undefined
        };
        const keyColor = keyColors.background;
        const keyColorHighlight = keyColors.hightlight;
        let doUseHightlight = true;
        this.getUseHighlight = () => doUseHightlight;
        this.setUseHighlight = (value) => doUseHightlight = value;
        const keyHandler = (target, on) => {
            const index = this.map.get(target);
            if (doUseHightlight)
                target.style.backgroundColor = on ? keyColorHighlight : keyColor;
            this.action(on, index);
        }; //keyHandler
        const upEventHandler = (event, isMove) => {
            if (isMove && event.buttons != 1) return;
            keyHandler(event.target, false);
        }; //upEventHandler
        const downEventHandler = event => {
            if (event.buttons != 1) return;
            keyHandler(event.target, true);
        }; //downEventHandler
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
        this.lastExplicitKeyWidth = undefined;
        this.defineGridTemplates = (keyWidth, keyHeight) => {
            if (keyWidth)
                this.keyWidth = keyWidth.toString();
            if (keyHeight)
                this.keyHeight = keyHeight.toString();
            const width = (/([0-9]*\.?[0-9]*)([a-zA-Z]*)/).exec(this.keyWidth);
            const widthValue = parseFloat(width[width.length-2])/2;
            const widthUnit = width[width.length-1];
            if (widthUnit != "fr")
                this.lastExplicitKeyWidth = this.keyWidth;
            this.element.style.gridTemplateColumns = `repeat(${2*this.number}, ${widthValue}${widthUnit})`;
            this.element.style.gridTemplateRows = `${this.keyHeight} ${this.keyHeight}`;    
        }; //this.defineGridTemplates
        this.defineGridTemplates(keyWidth, keyHeight);
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
  
    label(labelArray, startIndex) {
        if (startIndex == undefined) startIndex = 0;
        for (let keyValuePair of this.map)
            keyValuePair[0].textContent = labelArray[(keyValuePair[1] + startIndex) %  labelArray.length];
    } //label

    set fitView(booleanValue) {
        if (booleanValue)
            this.defineGridTemplates("1fr", undefined);
        else
            this.defineGridTemplates(this.lastExplicitKeyWidth, undefined);
    } //fitView

    setAction(handler) { 
        this.action = handler; // handler(bool down, integer keyIndex);
    } //setAction

    static makeGrandPiano(element, keyColors) {
        const kbd = new ScrollableKeyboard(element, "2.6em", "2.6em", 44, keyColors);
        kbd.label(["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"], 9); // start from A
        kbd.firstFrequency = 440/2/2/2/2; // lowest A
        kbd.tonalSystem = 12; // 12-TET
        return kbd;        
    } //makeGrandPiano

    get first() { return Array.from(this.map.values())[0];  }
    get last() {
        const array = Array.from(this.map.values());
        return array[array.length - 1];
    } //get last

    get useHighlight() { return getUseHighlight(); }
    set useHighlight(value) { return setUseHighlight(value); }

    showFrequencies(frequencies, prefix, suffix) {
        for (let [key, value] of this.map)
            key.title = `${key.parentElement.title}${prefix} ${frequencies[value]} ${suffix}`;
    } //showFrequencies

} //class ScrollableKeyboard
