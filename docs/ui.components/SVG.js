// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

class SVG {

    #implementation = {};

    constructor(viewBox) {
        const ns = "http://www.w3.org/2000/svg";
        this.#implementation.createNS = (name) => document.createElementNS(ns, name);
        this.#implementation.attribute = (element, values) => {
            for (let attribute in values)
                element.setAttribute(attribute, values[attribute]);
            return element;
        }; //this.#implementation.attribute
        // defaults:
        this.#implementation.lineStrokeColor = "black";
        this.#implementation.circleStrokeColor = "black";
        this.#implementation.rectangleStrokeColor = "black";
        this.#implementation.circleFillColor = "transparent";
        this.#implementation.rectangleFillColor = "transparent";
        this.#implementation.lineStrokeWidth = null;
        this.#implementation.circleStrokeWidth = null;
        this.#implementation.rectangleStrokeWidth = null;
        this.#implementation.svg = this.#implementation.createNS("svg");
        this.#implementation.svg.setAttribute("viewBox",
            `${viewBox.x.from} ${viewBox.y.from} ${viewBox.x.to - viewBox.x.from} ${viewBox.y.to - viewBox.y.from}`);
    } //constructor

    get element() { return this.#implementation.svg; }

    get lineStrokeColor() { return this.#implementation.lineStrokeColor; }
    set lineStrokeColor(value) { this.#implementation.lineStrokeColor = value; }
    get rectangleStrokeColor() { return this.#implementation.rectangleStrokeColor; }
    set rectangleStrokeColor(value) { this.#implementation.rectangleStrokeColor = value; }
    get circleStrokeColor() { return this.#implementation.circleStrokeColor; }
    set circleStrokeColor(value) { this.#implementation.circleStrokeColor = value; }
    get circleFillColor() { return this.#implementation.circleFillColor; }
    set circleFillColor(value) { this.#implementation.circleFillColor = value; }
    get rectangleFillColor() { return this.#implementation.rectangleFillColor; }
    set rectangleFillColor(value) { this.#implementation.rectangleFillColor = value; }
    get lineStrokeWidth() { return this.#implementation.lineStrokeWidth; }
    set lineStrokeWidth(value) { this.#implementation.lineStrokeWidth = value; }
    get circleStrokeWidth() { return this.#implementation.circleStrokeWidth; }
    set circleStrokeWidth(value) { this.#implementation.circleStrokeWidth = value; }
    get rectangleStrokeWidth() { return this.#implementation.rectangleStrokeWidth; }
    set rectangleStrokeWidth(value) { this.#implementation.rectangleStrokeWidth = value; }


    appendElement(element) {
        this.#implementation.svg.appendChild(element);
        return element;
    } //appendElement

    line(x1, x2, y1, y2) {
        const element = this.#implementation.createNS("line");
        this.#implementation.attribute(element, {x1: x1, x2: x2, y1: y1, y2: y2});
        element.style.strokeWidth = this.#implementation.lineStrokeWidth;
        element.style.stroke = this.#implementation.lineStrokeColor;
        return this.appendElement(element);
    } //line

    circle(cx, cy, r) {
        const element = this.#implementation.createNS("circle");
        this.#implementation.attribute(element, {cx: cx, cy: cy, r: r});
        this.#implementation.svg.appendChild(element);
        element.style.stroke = this.#implementation.circleStrokeColor;
        element.style.fill = this.#implementation.circleFillColor;
        element.style.strokeWidth = this.#implementation.circleStrokeWidth;
        return this.appendElement(element);
    } //circle

    rectangle(x, y, width, height, rx, ry) {
        const element = this.#implementation.createNS("rect");
        this.#implementation.attribute(element, {x: x, y: y, width: width, height: height});
        if (rx) this.#implementation.attribute(element, {rx: rx});
        if (ry) this.#implementation.attribute(element, {ry: ry});
        element.style.stroke = this.#implementation.rectangleStrokeColor;
        element.style.fill = this.#implementation.rectangleFillColor;
        element.style.strokeWidth = this.#implementation.rectangleStrokeWidth;
        return this.appendElement(element);
    } //rectangle

    text(x, y, value, size) {
        const element = this.#implementation.createNS("text");
        this.#implementation.attribute(element, {x: x, y: y});
        element.textContent = value;
        if (size) element.style.fontSize = size;
        return this.appendElement(element);
    } //text

} //class SVG