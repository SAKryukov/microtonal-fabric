// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

class CircularKeyboard {

    #implementation = { useKeyHightlight: true, keyMap: new Map() };

    constructor(parent) {
        const factor = 1.2;
        const svg = new SVG({
            x: { from: -factor, to: factor },
            y: { from: -factor, to: factor },
        });
        svg.lineStrokeWidth = "0.2%";
        svg.circleStrokeWidth = "0.2%";
        svg.circle(0, 0, 1);
        this.#implementation.addTone = (interval, size) => {
            const angle = Math.log2(interval) * Math.PI * 2 - Math.PI / 2;
            const getCenter = (angle, radius) => {
                if (!radius) radius = 1;
                return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) }
            };
            const location = getCenter(angle);
            svg.line(0, location.x, 0, location.y);
            if (!size) return;
            svg.circle(location.x, location.y, size);
        }; //this.#implementation.addTone
        parent.appendChild(svg.element);
    } //constructor
  
    label(handler) {
        for (let [key, value] of this.#implementation.keyMap)
            key.textContent = handler(value.x, value.y);
    } //label

    set action(handler) { 
        this.#implementation.action = handler; // handler(bool down, Object keyData);
    } //setAction
    get action() { this.#implementation.action; }

    get useHighlight() { return this.#implementation.useKeyHightlight; }
    set useHighlight(value) { this.#implementation.useKeyHightlight = value; }

    addTone(interval) { return this.#implementation.addTone(interval); }

} //class CircularKeyboard
