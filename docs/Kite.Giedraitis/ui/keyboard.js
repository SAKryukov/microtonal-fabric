class Keyboard {
    
    #implementation = { map: new Map() };

    constructor (parent) {
        const svg = new SVG({
            x: { from: -1000, to: +1000, },
            y: { from: -400, to: +400, } });
        svg.element.style.width = "100%";
        svg.element.style.height = "auto";
        const line1 = svg.line(-100, 100, 0, 200);
        parent.appendChild(svg.element);
        svg.lineStrokeColor = "red";
        svg.line(-100, 100, 10, 210);
        svg.text(200, 100, "my text", "820%");
        svg.circleStrokeColor = "red";
        svg.circleStrokeWidth = "1%";
        svg.circle(0, 0, 300);
        svg.rectangleStrokeWidth = "1%";
        svg.rectangleFillColor = "yellow";
        svg.rectangleStrokeColor = "Navy";
        svg.rectangle(-500, 0, 300, 200, 0, 0);
    } //constructor

} //class Keyboard