"use strict";

const applicationDefinitionSet = (() => {

    const temperament = (() => {
        const system = 29;
        const faOgolevets = 800 * Math.pow(2, -68/system);
        const startBrainin = 800 * Math.pow(2, -40/system);
        let instrument;
        return {
            system: system,
            startingFrequencies: [
                faOgolevets,
                startBrainin
            ],
            defaultChords: [
                [46, 56, 63],
                [40, 43, 45]
            ]
    }   ;
    })(); //temperament

    const result = {
        temperament: temperament,
        keyboardOptions: {
            highlightColor: "Chartreuse",
            chordColor: "LemonChiffon",
            chordTonicColor: "yellow",
        },
    }; //result

    return result;

})(); //applicationDefinitionSet
