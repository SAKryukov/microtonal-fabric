const interval = (edo, note) => 2 ** (note/edo);
const edo = 12;

const ionian = [
    "Ionian",
    { label: "C", step: 0 },
    { label: "D", step: 2 },
    { label: "E", step: 4 },
    { label: "F", step: 5 },
    { label: "G", step: 7 },
    { label: "A", step: 9 },
    { label: "B", step: 11 },
];
const dorian = [
    "Dorian",
    { label: "C", step: 0 },
    { label: "D", step: 2 },
    { label: "bE", step: 3 },
    { label: "F", step: 5 },
    { label: "G", step: 7 },
    { label: "A", step: 9 },
    { label: "B", step: 11 },
];

const playSet = set => {
    for (let mode of set) {
        console.log("[",);
        for (let x of mode)
            if (x.constructor == String) console.log(`// ${x}:`); else
            console.log(`{label: "${x.label}", interval: interval(${interval(edo, x.step)}, 1)}, `);
        console.log(" repeat],");
    }
};
playSet([ionian, dorian]);
