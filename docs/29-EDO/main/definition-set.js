"use strict";

const definitionSet = (() => {

    const version = "0.3.10";

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
