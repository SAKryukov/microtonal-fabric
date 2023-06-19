// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2023
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

const StrokeJoin = { miter:0, round:0, bevel:0, miterClip:"miter-clip", arcs:0 }

class SVG {

    #implementation = {};

    constructor(viewBox, existingSvg) {
        for (let index in StrokeJoin)
            if (StrokeJoin[index].constructor != String)
                StrokeJoin[index] = index;
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
        this.#implementation.polygonStrokeColor = "black";
        this.#implementation.circleFillColor = "transparent";
        this.#implementation.rectangleFillColor = "transparent";
        this.#implementation.polygonFillColor = "transparent";
        this.#implementation.lineStrokeWidth = "1%";
        this.#implementation.circleStrokeWidth = "1%";
        this.#implementation.rectangleStrokeWidth = "1%";
        this.#implementation.polygonStrokeWidth = "1%";
        this.#implementation.polygonStrokeLineJoin = StrokeJoin.round; 
        this.#implementation.svg = existingSvg == null ?
            this.#implementation.createNS("svg") : existingSvg;
        if (viewBox != null)
            this.#implementation.svg.setAttribute("viewBox",
                `${viewBox.x.from} ${viewBox.y.from} ${viewBox.x.to - viewBox.x.from} ${viewBox.y.to - viewBox.y.from}`);
    } //constructor

    get element() { return this.#implementation.svg; }

    get lineStrokeColor() { return this.#implementation.lineStrokeColor; }
    set lineStrokeColor(value) { this.#implementation.lineStrokeColor = value; }
    get rectangleStrokeColor() { return this.#implementation.rectangleStrokeColor; }
    set rectangleStrokeColor(value) { this.#implementation.rectangleStrokeColor = value; }
    get polygonStrokeColor() { return this.#implementation.polygonStrokeColor; }
    set polygonStrokeColor(value) { this.#implementation.polygonStrokeColor = value; }
    get circleStrokeColor() { return this.#implementation.circleStrokeColor; }
    set circleStrokeColor(value) { this.#implementation.circleStrokeColor = value; }
    get circleFillColor() { return this.#implementation.circleFillColor; }
    set circleFillColor(value) { this.#implementation.circleFillColor = value; }
    get rectangleFillColor() { return this.#implementation.rectangleFillColor; }
    set rectangleFillColor(value) { this.#implementation.rectangleFillColor = value; }
    get polygonFillColor() { return this.#implementation.polygonFillColor; }
    set polygonFillColor(value) { this.#implementation.polygonFillColor = value; }
    get lineStrokeWidth() { return this.#implementation.lineStrokeWidth; }
    set lineStrokeWidth(value) { this.#implementation.lineStrokeWidth = value; }
    get circleStrokeWidth() { return this.#implementation.circleStrokeWidth; }
    set circleStrokeWidth(value) { this.#implementation.circleStrokeWidth = value; }
    get rectangleStrokeWidth() { return this.#implementation.rectangleStrokeWidth; }
    set rectangleStrokeWidth(value) { this.#implementation.rectangleStrokeWidth = value; }
    get polygonStrokeWidth() { return this.#implementation.polygonStrokeWidth; }
    set polygonStrokeWidth(value) { this.#implementation.polygonStrokeWidth = value; }
    get polygonStrokeLineJoin() { return this.#implementation.polygonStrokeLineJoin; }
    set polygonStrokeLineJoin(value) { this.#implementation.polygonStrokeLineJoin = value; }

    appendElement(element, group) {
        if (group)
            group.appendChild(element);
        else
            this.#implementation.svg.appendChild(element);
        return element;
    } //appendElement

    line(x1, x2, y1, y2, group) {
        const element = this.#implementation.createNS("line");
        this.#implementation.attribute(element, {x1: x1, x2: x2, y1: y1, y2: y2});
        element.style.strokeWidth = this.#implementation.lineStrokeWidth;
        element.style.stroke = this.#implementation.lineStrokeColor;
        return this.appendElement(element, group);
    } //line

    circle(cx, cy, r, group) {
        const element = this.#implementation.createNS("circle");
        this.#implementation.attribute(element, {cx: cx, cy: cy, r: r});
        this.#implementation.svg.appendChild(element);
        element.style.stroke = this.#implementation.circleStrokeColor;
        element.style.fill = this.#implementation.circleFillColor;
        element.style.strokeWidth = this.#implementation.circleStrokeWidth;
        return this.appendElement(element, group);
    } //circle

    rectangle(x, y, width, height, rx, ry, group) {
        const element = this.#implementation.createNS("rect");
        this.#implementation.attribute(element, {x: x, y: y, width: width, height: height});
        if (rx) this.#implementation.attribute(element, {rx: rx});
        if (ry) this.#implementation.attribute(element, {ry: ry});
        element.style.stroke = this.#implementation.rectangleStrokeColor;
        element.style.fill = this.#implementation.rectangleFillColor;
        element.style.strokeWidth = this.#implementation.rectangleStrokeWidth;
        return this.appendElement(element, group);
    } //rectangle
    
    polygon(pointArray, group) {
        const element = this.#implementation.createNS("polygon");
        element.style.stroke = this.#implementation.rectangleStrokeColor;
        element.style.fill = this.#implementation.rectangleFillColor;
        element.style.strokeWidth = this.#implementation.rectangleStrokeWidth;
        for (let value of pointArray) {
            let point = this.element.createSVGPoint();
            point.x = value[0];
            point.y = value[1];
            element.points.appendItem(point);
        } //loop
        element.style.stroke = this.#implementation.polygonStrokeColor;
        element.style.fill = this.#implementation.polygonFillColor;
        element.style.strokeWidth = this.#implementation.polygonStrokeWidth;
        element.style.strokeLinejoin = this.#implementation.polygonStrokeLineJoin?.toString();
        return this.appendElement(element, group);
    } //polygon

    text(x, y, value, size, group) {
        const element = this.#implementation.createNS("text");
        this.#implementation.attribute(element, {x: x, y: y});
        element.textContent = value;
        if (size) element.style.fontSize = size;
        return this.appendElement(element, group);
    } //text

    group() { return this.appendElement(this.#implementation.createNS("g")); }

} //class SVG
