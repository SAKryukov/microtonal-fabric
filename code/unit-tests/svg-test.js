"use strict";

window.onload = () => {

    const halfSize = 1;
    const svg = new SVG({
        x: { from: -halfSize, to: halfSize, },
        y: { from: -halfSize, to: halfSize, }
    });

    svg.rectangleStrokeColor = "red";
    //svg.rectangleStrokeWidth = 0.01;
    svg.polygonStrokeColor = "blue";
    svg.polygonFillColor = "yellow";
    //svg.polygonStrokeWidth = 0.03;
    //svg.polygonStrokeLineJoin = StrokeJoin.bevel;

    const rectangle = svg.rectangle(-0.01, +0.01, 1, 0.3);
    const polygon = svg.polygon([[-0.9, -0.9], [0, 0], [-0.3, -0.5]]);

    document.body.appendChild(svg.element);

}; //window.onload
