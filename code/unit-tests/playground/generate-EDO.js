const interval = (edo, note) => 2 ** (note/edo);
const edo = 12;

// ♭♯

const Ionian = [
    "Ionian",
    { label: "C", step: 0 },
    { label: "D", step: 2 },
    { label: "E", step: 4 },
    { label: "F", step: 5 },
    { label: "G", step: 7 },
    { label: "A", step: 9 },
    { label: "B", step: 11 },
];
const Dorian = [
    "Dorian",
    { label: "C", step: 0 },
    { label: "D", step: 2 },
    { label: "♭E", step: 3 },
    { label: "F", step: 5 },
    { label: "G", step: 7 },
    { label: "A", step: 9 },
    { label: "B", step: 11 },
];
const Phrygian = [
    "Phrygian",
    { label: "C", step: 0 },
    { label: "♭D", step: 1 },
    { label: "♭E", step: 3 },
    { label: "F", step: 5 },
    { label: "G", step: 7 },
    { label: "A", step: 9 },
    { label: "B", step: 11 },
];

const Lydian = [
    "Lydian",
    { label: "C", step: 0 },
    { label: "D", step: 2 },
    { label: "E", step: 4 },
    { label: "♯F", step: 6 },
    { label: "G", step: 7 },
    { label: "A", step: 9 },
    { label: "C", step: 11 },
];

const Mixolydian = [
    "Mixolydian",
    { label: "C", step: 0 },
    { label: "D", step: 2 },
    { label: "E", step: 4 },
    { label: "F", step: 5 },
    { label: "G", step: 7 },
    { label: "A", step: 9 },
    { label: "♭C", step: 10 },
];

const Aeolian = [
    "Aeolian",
    { label: "C", step: 0 },
    { label: "D", step: 2 },
    { label: "♭E", step: 3 },
    { label: "F", step: 5 },
    { label: "G", step: 7 },
    { label: "A", step: 8 },
    { label: "B", step: 11 },
];

const Locrian = [
    "Locrian",
    { label: "C", step: 0 },
    { label: "♭D", step: 1 },
    { label: "♭E", step: 3 },
    { label: "F", step: 5 },
    { label: "♭G", step: 6 },
    { label: "♭A", step: 8 },
    { label: "B", step: 10 },
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
