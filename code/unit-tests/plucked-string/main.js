// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2023
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

window.onload = () => {

    const DefinitionSet = {
        halfSize: 1,
        widthLeft: 0.3,
        widthRight: 0.4,
        thickness: "0.3%",
    } //DefinitionSet

    const svg = new SVG({
        x: { from: -DefinitionSet.halfSize, to: DefinitionSet.halfSize, },
        y: { from: -DefinitionSet.halfSize, to: DefinitionSet.halfSize, }
    });

    svg.rectangleStrokeColor = "red";
    //svg.rectangleStrokeWidth = 0.01;
    svg.polygonStrokeColor = "blue";
    //svg.polygonFillColor = 
    svg.polygonStrokeWidth = DefinitionSet.thickness;
    svg.polygonStrokeLineJoin = StrokeJoin.bevel;

    svg.lineStrokeWidth = DefinitionSet.thickness;
    svg.line(-1, 1, 0, 0);
    //svg.line(-1, 1, -DefinitionSet.widthLeft, -DefinitionSet.widthRight);
    //svg.line(-1, 1, +DefinitionSet.widthLeft, +DefinitionSet.widthRight);
    const key = svg.polygon([[-1, -DefinitionSet.widthLeft], [1, -DefinitionSet.widthRight], [1, +DefinitionSet.widthRight], [-1, +DefinitionSet.widthLeft]])

    document.body.appendChild(svg.element);

    const keyboard = new StringKeyboard();
    
} //window.onload
