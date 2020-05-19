// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

const definitionSet = (() => {

    const version = sharedDefinitionSet.version;
    const years = sharedDefinitionSet.years;

    const temperament = (() => {
        const standardA = 440;
        const system = 29;
        const shiftOgolevetsA = 68;
        const shiftBraininA = 40;
        const shiftKryukovA = 82;
        const getStartingFrequency = shift => standardA * Math.pow(2, -shift / system);
        const startSA = standardA * Math.pow(2, -81 / system); // -82!!!
        let instrument;
        return {
            system: system,
            startingFrequencies: [
                getStartingFrequency(shiftOgolevetsA),
                getStartingFrequency(shiftBraininA),
                getStartingFrequency(shiftKryukovA),
            ],
            shiftsA: [
                shiftOgolevetsA,
                shiftBraininA,
                shiftKryukovA
            ],
            autoWhiteColors: [ true, false, true, ],
            defaultChords: [
                [46, 56, 63],
                [40, 50, 57],
                [60, 70, 77]
            ],
            byIndex: function(index) {
                return {
                    autoWhiteColor: this.autoWhiteColors[index],
                    startingFrequency: this.startingFrequencies[index],
                    shiftA: this.shiftsA[index],
                    defaultChord: this.defaultChords[index],
                }
            }, //byIndex
        };
    })(); //temperament

    const result = {
        version: version,
        years: years,
        temperament: temperament,
        keyboardOptions: {
            whiteKeyColor: "white",
            standardColorA: "Azure", // 440 Hz
            highlightColor: "Chartreuse",
            chordColor: "LemonChiffon",
            chordRootColor: "yellow",
        },
    }; //result

    return result;

})(); //definitionSet
