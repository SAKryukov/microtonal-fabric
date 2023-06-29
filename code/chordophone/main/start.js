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
        pitch: 200,
        volume: 2,
    } //DefinitionSet

    const svg = new SVG({
        x: { from: -DefinitionSet.halfSize, to: DefinitionSet.halfSize, },
        y: { from: -DefinitionSet.halfSize, to: DefinitionSet.halfSize, }
    });

    svg.rectangleStrokeColor = "red";
    svg.polygonStrokeColor = "blue";
    svg.element.style.width = "100%";
    //svg.polygonFillColor = 
    svg.polygonStrokeWidth = DefinitionSet.thickness;

    svg.lineStrokeWidth = DefinitionSet.thickness;
    svg.circleFillColor = "darkGray";
    svg.circle(0.7, 0, 1/4);
    svg.line(-1, +1, 0, 0);
    svg.line(0, 0, -1, 1);

    const createKeys = () => {
        const widthMiddle = (DefinitionSet.widthLeft + DefinitionSet.widthRight) / 2;
        const fretKey = svg.polygon([[-1, -DefinitionSet.widthLeft], [0, -widthMiddle], [0, +widthMiddle], [-1, +DefinitionSet.widthLeft]]);
        const pluckingKey = svg.polygon([[0, -widthMiddle], [1, -DefinitionSet.widthRight], [1, +DefinitionSet.widthRight], [0, +widthMiddle]]);
        return { fretKey: fretKey, pluckingKey: pluckingKey };
    };
    const keys = createKeys();

    const main = document.querySelector("main"); 
    main.appendChild(svg.element);

    let lastElement = null;
    let lastCoordinate = null;

    let instrument = null;
    const button = document.querySelector("button");
    button.focus();

    button.onclick = () => {
        instrument = new Instrument([DefinitionSet.pitch]);
        instrument.volume = DefinitionSet.volume;
        instrument.data = instrumentList[0];
        main.style.display = "block";
        document.body.removeChild(button);    
    };

    let pitch = DefinitionSet.pitch;

    const getPitch = (element, touchEvent) => {
        let max = 0;
        for (let touch of touchEvent.touches) {
            if (touch.target != element) continue;
            if (touch.clientX > max) max = touch.clientX; 
        }
        const x = max == 0 ? DefinitionSet.pitch : max;
        const keySize = element.getBoundingClientRect().width;
        let relative = x / keySize;
        const width = 2 - relative;
        relative = 2 / width;
        return DefinitionSet.pitch*relative;
    }; //getPitch

    const play = (element, volumeDelta) => {
        const keySize = DefinitionSet.widthRight * 2 * (element.getBoundingClientRect().height / DefinitionSet.halfSize / 2);
        const relative = Math.abs(volumeDelta)/keySize;
        instrument.play(true, 0, pitch, relative);
    } //play

    setMultiTouch(
        svg.element,
        element => element.constructor == SVGPolygonElement,
        (element, touchObject, on, event) => {
            if (element == keys.pluckingKey) {
                if (on) {
                    lastElement = element;
                    lastCoordinate = touchObject.clientY;
                    instrument.play(false, 0);
                } else {
                    if (lastElement == element)
                        play(element, touchObject.clientY - lastCoordinate);
                } //if    
            } else {
                pitch = getPitch(keys.fretKey, event);
                instrument.pitchShift(0, pitch);
            } //if
        },
        (element, touchObject, event) => { //same element
            if (element != keys.fretKey) return;
            pitch = getPitch(keys.fretKey, event);
            instrument.pitchShift(0, pitch);
        });

};
