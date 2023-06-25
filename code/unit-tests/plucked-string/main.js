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
    svg.element.style.width = "100%";
    //svg.polygonFillColor = 
    svg.polygonStrokeWidth = DefinitionSet.thickness;

    svg.lineStrokeWidth = DefinitionSet.thickness;
    svg.circleFillColor = "darkGray";
    svg.circle(0.7, 0, 1/4);
    //svg.line(-1, 1, -DefinitionSet.widthLeft, -DefinitionSet.widthRight);
    //svg.line(-1, 1, +DefinitionSet.widthLeft, +DefinitionSet.widthRight);
    svg.line(-1, +1, 0, 0);
    svg.line(0, 0, -1, 1);
    const key = svg.polygon([[-1, -DefinitionSet.widthLeft], [1, -DefinitionSet.widthRight], [1, +DefinitionSet.widthRight], [-1, +DefinitionSet.widthLeft]]);

    const main = document.querySelector("main"); 
    main.appendChild(svg.element);
    //main.style.display = "none";

    let lastElement = null;
    let lastCoordinate = null;

    let instrument = null;
    const button = document.querySelector("button");
    button.focus();

    button.onclick = () => {
        instrument = new Instrument([240]);
        instrument.volume = 3;
        instrument.data = instrumentList[0];
        main.style.display = "block";
        document.body.removeChild(button);    
    }

    const play = (element, volumeDelta) => {
        const keySize = DefinitionSet.widthRight * 2 * (svg.element.getBoundingClientRect().height / DefinitionSet.halfSize / 2);
        const relative = Math.abs(volumeDelta)/keySize;
        //console.log(element, "Relative: " + Math.abs(volumeDelta)/keySize);
        instrument.play(true, 0, 450, relative);
    } //play

    setMultiTouch(
        svg.element,
        element => element.constructor == SVGPolygonElement,
        (element, touchObject, on) => {
            if (on) {
                lastElement = element;
                lastCoordinate = touchObject.clientY;
                instrument.play(false, 0);
            } else {
                if (lastElement == element)
                    play(element, touchObject.clientY - lastCoordinate);
            } //if
        },
        (element, touchObject) => { //same element
        });

} //window.onload
