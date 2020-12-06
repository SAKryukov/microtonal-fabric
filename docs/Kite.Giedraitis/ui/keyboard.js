class Keyboard {

    static labelType = { none : 0, intervals: 1, noteNames: 2 };
    #implementation = {
        keyMap: new Map(), useHighlight: true,
        labelVisibility: Keyboard.labelType.intervals, chromaticPathVisibility: false,
    };

    constructor (parent) {
        const dy = 1; // triangle height, or half of hexagon height
        const dx = Math.sqrt(1.0/3); // half of hexagon size
        const triangleCenter = 1/3;
        const hex = (() => { // optimized line drawing
            const lineMap = new Set();
            const addLine = (svg, x1, x2, y1, y2) => {
                const hash = x1 + 10000 * x2 + 100000 * y1 + 1000000 * y2;
                if (lineMap.has(hash))
                    return;
                lineMap.add(hash);
                svg.line(x1, x2, y1, y2);
            }; //addLine
            const hex = (svg, x, y) => {
                addLine(svg, x, x - dx , y, y + 1);
                addLine(svg, x, x - dx, y, y - 1);
                addLine(svg, x, x + dx, y, y + 1);
                addLine(svg, x, x + dx, y, y - 1);
                addLine(svg, x, x - 2 * dx, y, y);
                addLine(svg, x, x + 2 * dx, y, y);
                addLine(svg, x - dx, x + dx, y - 1, y - 1);
                addLine(svg, x - dx, x + dx, y + 1, y + 1);
                addLine(svg, x - 2 * dx, x - dx, y, y + 1);
                addLine(svg, x - 2 * dx, x - dx, y, y - 1);
                addLine(svg, x + 2 * dx, x + dx, y, y + 1);
                addLine(svg, x + 2 * dx, x + dx, y, y - 1);
            }; //hex
            return hex;
        })(); // optimized line drawing
        const addToMap = (key, row, column, x, y) => {
            this.#implementation.keyMap.set(key, {row: row, column: column, x: x, y: y});
        }; //addToMap
        const mainKeys = svg => {
            for (let rowIndex = -1; rowIndex <= 1; ++rowIndex) {
                const shift = Math.abs(rowIndex);
                const rowWidth = 5 - shift;
                for (let xIndex = 0; xIndex < rowWidth; ++ xIndex) {
                    const y = rowIndex * dy;
                    const x = - 4 * dx + shift * dx + xIndex * dx * 2;
                    const key = svg.circle(x, y, dx/2);
                    addToMap(key, 3 * rowIndex, xIndex, x, y);
                } //loop x
            } //loop y
        }; //mainKeys
        const secondaryKeys = svg => {
            for (let yIndex of [-1, +1]) {
                for (let xIndex = -1; xIndex <= 1; ++xIndex) {
                    const x = xIndex * dx * 2;
                    const y = yIndex * (dy - triangleCenter);
                    const key = svg.circle(x, y, dx/2);
                    addToMap(key, 2 * yIndex, xIndex + 1, x, y);
                }
            }
            for (let yIndex of [-1, +1]) {
                for (let xIndex = 0; xIndex < 4; ++xIndex) {
                    const x = -dx * 3 + xIndex * 2 * dx;
                    const y = yIndex * triangleCenter;
                    const key = svg.circle(x, y, dx/2);
                    addToMap(key, 1 * yIndex, xIndex, x, y);
                }
            }
        }; //secondaryKeys
        const createMain = () => {
            const svg = new SVG({
                x: { from: -4.6*dx, to: +4.6*dx, },
                y: { from: -dy - dx*0.6, to: +dy + dx*0.6, } });
            svg.lineStrokeWidth = 0.02;
            svg.circleStrokeWidth = "0.04";
            svg.element.style.width = "50%";
            svg.element.style.marginLeft = "0";
            svg.element.style.marginTop = "0";
            svg.element.style.height = "auto";
            hex(svg, 0, 0);
            hex(svg, -dx*2, 0);
            hex(svg, +dx*2, 0);
            mainKeys(svg);
            secondaryKeys(svg);
            const intervals = (() => {
                const generator = new Interval(3, 2);
                const intervals = [];
                const rows = [
                    { start: new Interval(10, 9), length: 4 },
                    { start: new Interval(40, 21), length: 3 },
                    { start: new Interval(14, 9), length: 4 },
                    { start: new Interval(16, 9), length: 5 },
                    { start: new Interval(32, 21), length: 4 },
                    { start: new Interval(28, 15), length: 3 },
                    { start: new Interval(16, 15), length: 4 },
                ];
                for (let rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
                    let current = rows[rowIndex].start;
                    const row = [current];
                    for (let columnIndex = 1; columnIndex < rows[rowIndex].length; ++columnIndex) {
                        current = current.multiply(generator).normalize();
                        row.push(current);
                    }
                    intervals.push(row);
                }
                return intervals;
            })(); //intervals
            const intervalLabelGroup = svg.group();
            const noteLabelGroup = svg.group();
            const chromaticGroup = svg.group();
            (() => { //setVisibilityControl
                const show = (element, value) => element.style.display = value ? null : "none";
                this.#implementation.setIntervalLabelGroupVisibility = value => {
                    show(intervalLabelGroup, value == Keyboard.labelType.none ? false : (value == Keyboard.labelType.intervals ? true : false));
                    show(noteLabelGroup, value == Keyboard.labelType.none ? false : (value == Keyboard.labelType.noteNames ? true : false));
                    this.#implementation.labelVisibility = value;
                } //this.#implementation.setIntervalLabelGroupVisibility
                this.#implementation.setChromaticPathVisibility = value => {
                    show(chromaticGroup, value);
                    this.#implementation.chromaticPathVisibility = value;
                };
            })(); //setVisibilityControl
            this.#implementation.setIntervalLabelGroupVisibility(Keyboard.labelType.intervals);
            this.#implementation.setChromaticPathVisibility(false);
            const sorted = [];
            let keyIndex = 0;
            const instrumentFrequencySet = [];
            this.#implementation.getInstrumentFrequencySet = () => instrumentFrequencySet;
            for (let [key, value] of this.#implementation.keyMap) {
                let color;
                switch (value.row) {
                    case -3: color = "yellow"; break;
                    case -2: color = "#FFBB44"; break;
                    case -1: color = "#8075FF"; break;
                    case  0: color = "white"; break;
                    case +1: color = "#FF6070"; break;
                    case +2: color = "PaleTurquoise"; break;
                    case +3: color = "lightGreen"; break;
                }
                key.style.fill = color;
                value.interval = intervals[value.row + 3][value.column];
                svg.text(value.x, value.y, value.interval.toString(), 0.2, intervalLabelGroup);
                sorted.push(value);
            }
            (function setNoteNamesAndChromaticPath() {
                const noteNames = ["C", "C♯¹", "C♯²", "D♭²", "D♭¹", "D", "D♯", "de", "E♭", "E", "E♯", "F♭", "F",
                    "F♯", "G♭", "G", "G♯", "ga", "A♭", "A", "A♯¹", "A♯²", "ab", "B♭²", "B♭¹", "B", "bc"];
                sorted.sort((first, second) => {
                    const a = first.interval.toReal();
                    const b = second.interval.toReal();
                    return a == b ? 0 : (a < b ? -1 : 1);
                }); //sort
                let noteIndex = 0;
                const currentChromaticPoint = { x: undefined, y: undefined };
                const chromaticLineColors = ["darkRed", "darkOrange", "gold", "darkGreen", "slateBlue", "midnightBlue", "darkViolet"];
                let currentChromaticLineColor = 0;
                svg.lineStrokeColor = chromaticLineColors[currentChromaticLineColor];
                for (let value of sorted) {
                    if (noteIndex % 4 == 0)
                        svg.lineStrokeColor = chromaticLineColors[currentChromaticLineColor++];
                    const newX = value.x + Math.random() * dx / 4;
                    const newY = value.y + Math.random() * dx / 4;
                    if (currentChromaticPoint.x != undefined && noteIndex < 10000)
                        svg.line(currentChromaticPoint.x, newX, currentChromaticPoint.y, newY, chromaticGroup);
                    currentChromaticPoint.x = newX; currentChromaticPoint.y = newY;
                    instrumentFrequencySet.push(value.interval.toReal());
                    value.keyIndex = noteIndex;
                    value.noteName = noteNames[noteIndex++];
                    svg.text(value.x, value.y, value.noteName, 0.2, noteLabelGroup);
                } //loop sorted value
            })(); //setNoteNamesAndChromaticPath
            (() => { // handlers
                this.#implementation.setKeyHander = aHandler => {
                    this.#implementation.keyHandler = aHandler;
                    if (aHandler) svg.element.style.opacity = 1;
                }; //
                const handler = (element, on) => {
                    if (!this.#implementation.keyHandler) return;
                    const value = this.#implementation.keyMap.get(element);
                    if (!value)
                        return; //work-around
                    if (this.#implementation.useHighlight) {
                        element.style.stroke = on ? "red" : "black";
                        element.style.strokeWidth = on ? 2 * svg.circleStrokeWidth : svg.circleStrokeWidth;
                    } //if
                    this.#implementation.keyHandler(on, value.keyIndex);
                } //handler
                for (let [key, _] of this.#implementation.keyMap) {
                    key.onmousedown = event => handler(event.target, true);
                    key.onmouseup = event => handler(event.target, false);
                    key.onmouseenter = event => { if (event.buttons == 1) handler(event.target, true); }
                    key.onmouseleave = event => { if (event.buttons == 1) handler(event.target, false); }
                } //key
                setMultiTouch(
                    svg.element,
                    element => element.constructor == SVGCircleElement, 
                    (element, _, on) => handler(element, on)
                );    
            })(); // handlers
            return svg.element;
        }; //createMain
        parent.appendChild(createMain());
    } //constructor

    get labelVisibility() { return this.#implementation.labelVisibility; }
    set labelVisibility(value) { return this.#implementation.setIntervalLabelGroupVisibility(value); }
    get chromaticPathVisibility() { return this.#implementation.chromaticPathVisibility; }
    set chromaticPathVisibility(value) { return this.#implementation.setChromaticPathVisibility(value); }

    get useHighlight() { return this.#implementation.useHighlight; }
    set useHighlight(value) { this.#implementation.useHighlight = value; }

    set keyHandler(aHandler) { this.#implementation.setKeyHander(aHandler); }

    get instrumentFrequencySet() { return this.#implementation.getInstrumentFrequencySet(); }

} //class Keyboard