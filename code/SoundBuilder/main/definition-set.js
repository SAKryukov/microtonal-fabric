// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/5268512/Sound-Builder

"use strict";

const definitionSet = {

    formatVersion: "3.1.0",
    title: "Sound Builder",
    copyright: years => `Copyright &copy; ${years} by S A Kryukov`,

    keyboardKeyColors: {
        background: "white",
        hightlight: "Chartreuse",
        border: "lightGray",
        label: "gray",
    },

    fileStorage: {
        initialInstrumentFileName: "instrument.json",
        initialInstrumentListFileName: "instrumentList.js",
        instrumentListFileObjectName: "instrumentList",
        tabSizeJSON: 4,     
    },

} //class definitionSet
