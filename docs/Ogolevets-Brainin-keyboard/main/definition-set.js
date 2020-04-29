"use strict";

const applicationDefinitionSet = (() => {

    const version = "0.1.0";

    const temperament = (() => {
        const system = 29;
        const faOgolevets = 400 * Math.pow(2, -68/system);
        const startBrainin = 400 * Math.pow(2, -40/system);
        let instrument;
        return {
            system: system,
            startingFrequencies: [
                faOgolevets,
                startBrainin
            ],
            defaultChords: [
                [46, 56, 63],
                [40, 50, 57]
            ]
    }   ;
    })(); //temperament

    const result = {
        version: version,
        temperament: temperament,
        keyboardOptions: {
            highlightColor: "Chartreuse",
            chordColor: "LemonChiffon",
            chordTonicColor: "yellow",
        },
    }; //result

    return result;

})(); //applicationDefinitionSet
