class Keyboard {
    
    #implementation = { map: new Map() };

    constructor (parent) {
        const dy = 1; // triangle height, or half of hexagon heigh
        const dx = Math.sqrt(1.0/3); // half of hexagon size
        const triangleCenter = 1/3;    const test = () => {
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
            svg.rectangleFillColor = "yellow";
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
        const hexRows = svg => {
            hex(svg, 0, 0);
            hex(svg, 4 * dx, 0);
            hex(svg, -4 * dx, 0);
            hex(svg, -dx, dy);
            hex(svg, 4 * dx -dx , dy);
            hex(svg, -4 * dx - dx, dy);
        }; //hexRows
        const horizontals = svg => {
            for (let index = 0; index < 3; ++index) {
                const x0 = - dx * 8 + dx * index;
                const y = index * dy;
                svg.line(x0, -x0, y, y);
                svg.line(x0, -x0, -y, -y);
            }
        }; //horizontals
        const diagonals = svg => {
            for (let index = -4; index <= 4; ++index) {
                svg.line(2 * index * dx -2 * dx, 2 * index * dx + 2 * dx, -dy * 2, + dy * 2);
                svg.line(2 * index * dx +2 * dx, 2 * index * dx - 2 * dx, -dy * 2, + dy * 2);
            }
        }; //diagonals
        const mainKeys = svg => {
            for (let rowIndex = -2; rowIndex <= 2; ++rowIndex) {
                const shift = Math.abs(rowIndex);
                const rowWidth = 9 - shift;
                for (let xIndex = 0; xIndex < rowWidth; ++ xIndex) {
                    const y = rowIndex * dy;
                    const x = - 8 * dx + shift * dx + xIndex * dx * 2;
                    svg.circle(x, y, dx/2);
                } //loop x
            } //loop y
        }; //mainKeys
        const secondaryKeys = svg => {
            const x = 0;
            const y = 0;
            svg.circle(x + 0, y + dy * 2 * triangleCenter, dx/2);
            svg.circle(x + dx, y + dy * triangleCenter, dx/2);
        }; //secondaryKeys
        const testHex = () => {
            const svg = new SVG({
                x: { from: -10*dx, to: +10*dx, },
                y: { from: -2.5, to: +2.5, } });
            svg.lineStrokeWidth = "0.02";
            svg.circleStrokeWidth = "0.04";
            svg.circleFillColor = "yellow";
            svg.element.style.width = "70%";
            svg.element.style.marginLeft = "15%";
            svg.element.style.height = "auto";
            horizontals(svg);
            diagonals(svg);
            mainKeys(svg);
            secondaryKeys(svg);
            //hexRows(svg);
            // star(svg, - 2 * dx, 0);
            // star(svg, 2 * dx, 0);
            // star(svg, 0, 2 * dy);
            return svg.element;
        }; //test
        parent.appendChild(testHex());
    } //constructor

} //class Keyboard