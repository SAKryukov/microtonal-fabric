class Keyboard {
    
    #implementation = { keyMap: new Map(), labelVisibility: true };

    constructor (parent) {
        const dy = 1; // triangle height, or half of hexagon height
        const dx = Math.sqrt(1.0/3); // half of hexagon size
        const triangleCenter = 1/3;
        const test = () => {
            const svg = new SVG({
                x: { from: -1000, to: +1000, },
                y: { from: -400, to: +400, } });
            svg.element.style.width = "100%";
            svg.element.style.height = "auto";
            const line1 = svg.line(-100, 100, 0, 200);
            svg.lineStrokeColor = "red";
            svg.line(-100, 100, 10, 210);
            svg.text(200, 100, "my text", "820%");
            svg.circleStrokeColor = "red";
            svg.circleStrokeWidth = "0.1%";
            svg.circle(0, 0, 300);
            svg.rectangleStrokeWidth = "1%";
            svg.rectangleFillColor = "#FFAAFF";
            svg.rectangleStrokeColor = "Navy";
            svg.rectangle(-500, 0, 300, 200, 0, 0);
            return svg.element;
        } //test
        const hex = (svg, x, y) => {
            svg.line(x, x - dx , y, y + 1);
            svg.line(x, x - dx, y, y - 1);
            svg.line(x, x + dx, y, y + 1);
            svg.line(x, x + dx, y, y - 1);
            svg.line(x, x - 2 * dx, y, y);
            svg.line(x, x + 2 * dx, y, y);
            svg.line(x - dx, x + dx, y - 1, y - 1);
            svg.line(x - dx, x + dx, y + 1, y + 1);
            svg.line(x - 2 * dx, x - dx, y, y + 1);
            svg.line(x - 2 * dx, x - dx, y, y - 1);
            svg.line(x + 2 * dx, x + dx, y, y + 1);
            svg.line(x + 2 * dx, x + dx, y, y - 1);
        }; //hex
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
        const testHex = () => {
            const svg = new SVG({
                x: { from: -5*dx, to: +5*dx, },
                y: { from: -dy - dx, to: +dy + dx, } });
            svg.lineStrokeWidth = "0.02";
            svg.circleStrokeWidth = "0.04";
            svg.circleFillColor = this.toCSSColor(244, 255, 2*255/3);
               //this.averageColor({r: 255, g:255, b:255}, {r: 255, g:255, b:0});
            svg.element.style.width = "70%";
            svg.element.style.marginLeft = "15%";
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
            })();
            const intervalLabelGroup = svg.group();
            this.#implementation.setIntervalLabelGroupVisibility = value => {
                intervalLabelGroup.setAttribute("display", value ? null : "none");
                this.#implementation.labelVisibility = value;
            } //this.#implementation.setIntervalLabelGroupVisibility
            for (let [key, value] of this.#implementation.keyMap) {
                let color;
                switch (value.row) {
                    case -3: color = "yellow"; break;
                    case -2: color = "orange"; break;
                    case -1: color = "#8075FF"; break;
                    case  0: color = "white"; break;
                    case +1: color = "#FF6070"; break;
                    case +2: color = "PaleTurquoise"; break;
                    case +3: color = "lightGreen"; break;
                }
                key.style.fill = color;
                value.interval = intervals[value.row + 3][value.column];
                value.label = svg.text(value.x, value.y, value.interval.toString(), 0.2, intervalLabelGroup);
            }
            return svg.element;
        }; //test
        parent.appendChild(testHex());
    } //constructor

    get labelVisibility() { return this.#implementation.labelVisibility; }
    set labelVisibility(value) { return this.#implementation.setIntervalLabelGroupVisibility(value); }

    toCSSColor(r, g, b) { return `rgb(${r}, ${g}, ${b})`; }
    averageColor(first, second) {
        const r = first.r + second.r / 2;
        const g = first.g + second.g / 2;
        const b = first.b + second.b / 2;
        return `rgb(${r}, ${g}, ${b})`;
    }
    get colorGreen() { return {r:0, g:255, b: 0}}


} //class Keyboard