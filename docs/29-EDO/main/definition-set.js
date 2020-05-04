"use strict";

const definitionSet = (() => {

    const version = "0.3.9";

    const temperament = (() => {
        const system = 29;
        const faOgolevets = 440 * Math.pow(2, -68/system);
        const startBrainin = 440 * Math.pow(2, -40/system);
        const startSA = 440 * Math.pow(2, -81/system);
        let instrument;
        return {
            system: system,
            startingFrequencies: [
                faOgolevets,
                startBrainin,
                startSA
            ],
            defaultChords: [
                [46, 56, 63],
                [40, 50, 57],
                [60, 70, 77]
            ]
    }   ;
    })(); //temperament

    const result = {
        version: version,
        temperament: temperament,
        keyboardOptions: {
            highlightColor: "Chartreuse",
            chordColor: "LemonChiffon",
            chordRootColor: "yellow",
        },
    }; //result

    return result;

})(); //definitionSet
