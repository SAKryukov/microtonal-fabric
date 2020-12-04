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
        this.#implementation.circleFillColor = "transparent";
        this.#implementation.lineStrokeWidth = null;
        this.#implementation.circleStrokeWidth = null;
        this.#implementation.svg = this.#implementation.createNS("svg");
        this.#implementation.svg.setAttribute("viewBox",
            `${viewBox.x.from} ${viewBox.y.from} ${viewBox.x.to - viewBox.x.from} ${viewBox.y.to - viewBox.y.from}`);
    } //constructor

    get element() { return this.#implementation.svg; }

    get lineStrokeColor() { return this.#implementation.lineStrokeColor; }
    set lineStrokeColor(value) { this.#implementation.lineStrokeColor = value; }
    get circleStrokeColor() { return this.#implementation.circleStrokeColor; }
    set circleStrokeColor(value) { this.#implementation.circleStrokeColor = value; }

    line(x1, x2, y1, y2) {
        const element = this.#implementation.createNS("line");
        this.#implementation.attribute(element, {x1: x1, x2: x2, y1: y1, y2: y2});
        element.style.strokeWidth = this.#implementation.lineStrokeWidth;
        element.style.stroke = this.#implementation.lineStrokeColor;
        this.#implementation.svg.appendChild(element);
        return element;
    } //line

} //class SVG