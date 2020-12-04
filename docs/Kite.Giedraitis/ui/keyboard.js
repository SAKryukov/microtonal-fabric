class Keyboard {
    
    #implementation = { map: new Map() };

    constructor (parent) {
        const svg = new SVG({
            x: { from: -1000, to: +1000, },
            y: { from: -1000, to: +1000, } });
        svg.line(-100, 100, 0, 200);
        parent.appendChild(svg.element);
        svg.lineStrokeColor = "red";
        svg.line(-100, 100, 10, 210);
    } //constructor


} //class Keyboard