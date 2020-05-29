// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

const sharedDefinitionSet = {

    version: "4.7.6", // Not propagated. What's wrong?
    years: "2017-2020",

    soundControl: {
        audibleMiddle: { note: "C", midiNote: 60, frequency: 261.625 },
        defaultOctave: 0,
        minTransposition: -24,
        maxTransposition: +24,
        transpositionStep: 1,
        minVolume: 0,
        maxVolume: 1,
        initialVolume: 0.4,
        volumeStep: 0.01,
    },

}; //sharedDefinitionSet
