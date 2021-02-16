const interval = (edo, note) => 2 ** (note/edo);
const edo = 12;

// ♭♯

const Ionian = [
    "Ionian", // 0 2 4 5 7 9 11
    { label: "C", step: 0 },
    { label: "D", step: 2 },
    { label: "E", step: 4 },
    { label: "F", step: 5 },
    { label: "G", step: 7 },
    { label: "A", step: 9 },
    { label: "B", step: 11 },
];
const Dorian = [
    "Dorian", // 1 2 b3 4 5 6 b7 8 (flat 3,7)
    { analog: "D 02", label: "C", step: 0 },
    { analog: "E 04", label: "D", step: 2 },
    { analog: "F 05", label: "♭E", step: 3 },
    { analog: "G 07", label: "F", step: 5 },
    { analog: "A 09", label: "G", step: 7 },
    { analog: "B 11", label: "A", step: 9 },
    { analog: "C 12", label: "♭B", step: 10 },
];
const Phrygian = [
    "Phrygian", // 1 b2 b3 4 5 b6 b7 8 (flat 2,3,6,7)
    { analog: "E 04", label: "C", step: 0 },
    { analog: "F 05", label: "♭D", step: 1 },
    { analog: "G 07", label: "♭E", step: 3 },
    { analog: "A 09", label: "F", step: 5 },
    { analog: "B 11", label: "G", step: 7 },
    { analog: "C 12", label: "♭A", step: 8 },
    { analog: "D 02", label: "♭B", step: 10 },
];

const Lydian = [
    "Lydian", // 1 2 3 #4 5 6 7 8 (sharp 4)
    { analog: "F 05", label: "C", step: 0 },
    { analog: "G 07", label: "D", step: 2 },
    { analog: "A 09", label: "E", step: 4 },
    { analog: "B 11", label: "♯F", step: 6 },
    { analog: "C 12", label: "G", step: 7 },
    { analog: "D 02", label: "A", step: 9 },
    { analog: "E 04", label: "C", step: 11 },
];

const Mixolydian = [
    "Mixolydian", // 1 2 3 4 5 6 b7 (flat 7)
    { analog: "G 07", label: "C", step: 0 },
    { analog: "A 09", label: "D", step: 2 },
    { analog: "B 11", label: "E", step: 4 },
    { analog: "C 12", label: "F", step: 5 },
    { analog: "D 02", label: "G", step: 7 },
    { analog: "E 04", label: "A", step: 9 },
    { analog: "F 05", label: "♭C", step: 10 },
];

const Aeolian = [
    "Aeolian", // 1 2 b3 4 5 b6 b7 8 (flat 3,6,7)
    { analog: "A 09", label: "C", step: 0 },
    { analog: "B 11", label: "D", step: 2 },
    { analog: "C 12", label: "♭E", step: 3 },
    { analog: "D 02", label: "F", step: 5 },
    { analog: "E 04", label: "G", step: 7 },
    { analog: "F 05", label: "♭A", step: 8 },
    { analog: "G 07", label: "♭B", step: 10 },
];

const Locrian = [
    "Locrian", // 1 b2 b3 4 b5 b6 b7 8 (flat 2,3,5,6,7)
    { analog: "B 11", label: "C", step: 0 },
    { analog: "C 12", label: "♭D", step: 1 },
    { analog: "D 02", label: "♭E", step: 3 },
    { analog: "E 04", label: "F", step: 5 },
    { analog: "F 05", label: "♭G", step: 6 },
    { analog: "G 07", label: "♭A", step: 8 },
    { analog: "A 09", label: "♭B", step: 10 },
];

const playSet = set => {
    for (let mode of set) {
        if (mode[0] && mode[0].constructor == String)
            console.log(`        [ // ${mode[0]}:`,);
        for (let x of mode)
            if (x.constructor == Object)
                console.log(`            {label: "${x.label}", interval: interval(${interval(edo, x.step)}, 1)}, `);
        console.log("        repeat],");
    }
};
playSet([Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian]);


/*
from http://learneasymusictheory.freehostia.com/modes.shtml
Ionian: 1 2 3 4 5 6 7 8 (no changes)
Dorian: 1 2 b3 4 5 6 b7 8 (flat 3,7)
Phrygian: 1 b2 b3 4 5 b6 b7 8 (flat 2,3,6,7)
Lydian: 1 2 3 #4 5 6 7 8 (sharp 4)
Mixolydian: 1 2 3 4 5 6 b7 (flat 7)
Aeolian: 1 2 b3 4 5 b6 b7 8 (flat 3,6,7)
Locrian: 1 b2 b3 4 b5 b6 b7 8 (flat 2,3,5,6,7)
*/