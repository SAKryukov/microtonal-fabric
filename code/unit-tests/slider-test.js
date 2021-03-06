// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

const slider = new Slider({
    label: "One:",
    step: 0.1,
    indicatorSuffix: "%",
    indicatorWidth: "3em"
}, document.querySelector("#test"));

const slider2 = new Slider({ label: null, value: 57.3, step: 0.1, indicatorWidth: "3em" }, document.querySelector("#test2"));

slider.setValue(99.2);
slider2.focus();