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

    const keyboardLayoutSet = (() => {
        const standardA = 440;
        const system = 29;
        const commonPracticeSystem = 12;
        const shiftOgolevetsA = 68;
        const shiftBraininA = 40;
        const shiftKryukovA = 82;
        const getStartingFrequency = (shift, system) => standardA * Math.pow(2, -shift / system);
        return {
            count: 4,
            systems: [system, system, system, commonPracticeSystem],
            startingFrequencies: [
                getStartingFrequency(shiftOgolevetsA, system),
                getStartingFrequency(shiftBraininA, system),
                getStartingFrequency(shiftKryukovA, system),
                getStartingFrequency(shiftBraininA, commonPracticeSystem),
            ],
            shiftsA: [
                shiftOgolevetsA,
                shiftBraininA,
                shiftKryukovA,
                shiftBraininA,
            ],
            svgIndices: [0, 1, 2, 1], // Braining-Ogolevets, piano (Brainin), Kryukov, piano (12 EDO)
            autoWhiteColors: [ true, false, true, false ],
            defaultChords: [
                [46, 56, 63],
                [40, 50, 57],
                [60, 70, 77],
                [31, 35, 38],
            ],
            byIndex: function(index) {
                return {
                    system: this.systems[index],
                    autoWhiteColor: this.autoWhiteColors[index],
                    startingFrequency: this.startingFrequencies[index],
                    defaultChord: this.defaultChords[index],
                    shiftA: this.shiftsA[index],
                    svgIndex: this.svgIndices[index],
                }
            }, //byIndex
        };
    })(); //keyboardLayoutSet

    const result = {
        version: version,
        years: years,
        keyboardLayoutSet: keyboardLayoutSet,
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
