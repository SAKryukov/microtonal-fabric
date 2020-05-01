const tonalSystem = 29;
const frequencies = [];
const firstFrequency = 27.5;

for (let index = 0; index < tonalSystem; ++index) {
    const frequency = firstFrequency * Math.pow(2, index / tonalSystem);
    frequencies.push({ index: index, frequency: frequency });
}

let minQuarta = Number.POSITIVE_INFINITY;
let minQuartaIndex = undefined;
let minQuinta = Number.POSITIVE_INFINITY;
let minQuintaIndex = undefined;
for (let f of frequencies) {
    let differenceQuarta = (4/3) - (f.frequency/firstFrequency);
    differenceQuarta = differenceQuarta * differenceQuarta;
    let differenceQuinta = (3/2) - (f.frequency/firstFrequency);
    differenceQuinta = differenceQuinta * differenceQuinta;
    if (minQuarta > differenceQuarta) {
        minQuarta = differenceQuarta;
        minQuartaIndex = f.index;
    }
    if (minQuinta > differenceQuinta) {
        minQuinta = differenceQuinta;
        minQuintaIndex = f.index;
    }
    console.log(f.index, f.frequency, (3/2) / (f.frequency/firstFrequency), (4/3) / (f.frequency/firstFrequency));
}
console.log(minQuartaIndex, minQuintaIndex);