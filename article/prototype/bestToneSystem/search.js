const util = require("util");
const el = require('os').EOL;

const western = 12;
const cents = 1200;
const cent = Math.pow(2, 1 / cents);
const halftone = Math.pow(2, 1 / western);

/*
const notes = [ // https://en.wikipedia.org/wiki/Just_intonation
    { name: 'C', interval: 00, justNumerator: 01, justDenominator: 01 },
    { name: 'D', interval: 02, justNumerator: 09, justDenominator: 08 },
    { name: 'E', interval: 04, justNumerator: 05, justDenominator: 04 },
    { name: 'F', interval: 05, justNumerator: 04, justDenominator: 03 },
    { name: 'G', interval: 07, justNumerator: 03, justDenominator: 02 },
    { name: 'A', interval: 09, justNumerator: 05, justDenominator: 03 },
    { name: 'B', interval: 11, justNumerator: 15, justDenominator: 08 }
];
*/

const notes = [ // https://en.wikipedia.org/wiki/Just_intonation
    { name: 'C', interval: 00, justNumerator: 01, justDenominator: 01 },
    { name: 'Eb', interval: 02, justNumerator: 06, justDenominator: 05 },
    { name: 'E', interval: 04, justNumerator: 05, justDenominator: 04 },
    { name: 'F', interval: 05, justNumerator: 04, justDenominator: 03 },
    { name: 'G', interval: 07, justNumerator: 03, justDenominator: 02 }
];

(function setupNotes() {
    notes.first = notes[1];
    notes.last = notes[notes.length - 1];
    let index = 0;
    for (let note of notes) {
        note.index = index++;
        note.complexity = Math.max(note.justDenominator, note.justNumerator);
        note.frequency = note.justNumerator / note.justDenominator;
        note.cents = Math.log(note.frequency) / Math.log(cent);
    }
})();

function approximationBadness(justNote, systemNote, system) {
    const badness = justNote.cents - systemNote * cents / system;
    const relativeBadness = Math.sqrt(badness * badness) / justNote.complexity;
    return relativeBadness;
} //approximationBadness

function findByBadness(justNote, system) {
    if (justNote.interval == 0) { return 0; }
    let minBadness = cents;
    let bestNote = null;
    for (let equalNote = 1; equalNote < system; ++equalNote) {
        const badness = approximationBadness(justNote, equalNote, system);
        if (badness < minBadness) {
            minBadness = badness;
            bestNote = equalNote;
        } //if
    } //loop
    return { justNote: justNote, interval: bestNote, badness: minBadness };
} //findByBadness

function SystemDescriptor(system) {
    let accumulatedBadness = 0;
    const approximationSet = [];
    for (let justIndex = notes.first.index; justIndex <= notes.last.index; ++justIndex) {
        const justNote = notes[justIndex];
        const approximation = findByBadness(justNote, system);
        if (accumulatedBadness < approximation.badness)
            accumulatedBadness = approximation.badness;
        approximationSet.push(approximation);
    } //loop
    this.system = system;
    this.badness = accumulatedBadness;
    this.approximationSet = approximationSet;
} //SystemDescriptor

SystemDescriptor.prototype.toString = function() {
    let result = util.format("System: %s-TET:%s", this.system, el);
    for (let note of this.approximationSet)
        result += util.format("\t%s: interval %d, badness %d cents (compared to just: %s/%s)%s",
            note.justNote.name,
            note.interval,
            note.justNote.cents - note.interval * cents / this.system,
            note.justNote.justNumerator,
            note.justNote.justDenominator,
            el);
    result += "Intervals:";
    let previous = 0;
    for (let note of this.approximationSet) {
        result += util.format(" %d", note.interval - previous);
        previous = note.interval;
    }
    result += util.format(" %d", this.system - previous);
    return result;
}; //SystemDescriptor.prototype.toString

//debugger;

function findChampion(max) {
    let minRelativeBadness = cents * max * max;
    let bestSystem;
    for (let index = 7; index < max; ++index) {
        const evaluation = new SystemDescriptor(index);
        const relativeBadness = evaluation.badness / index;
        if (relativeBadness < minRelativeBadness) {
            minRelativeBadness = relativeBadness;
            bestSystem = evaluation; 
        } //if
    } //loop
    return bestSystem;
} //findChampion

const result = findChampion(30);
console.log(result.toString());

/*
const evaluation12 = new SystemDescriptor(12);
console.log(evaluation12.toString());
const evaluation = new SystemDescriptor(29);
console.log(evaluation.toString());
const evaluation19 = new SystemDescriptor(19);
console.log(evaluation19.toString());
*/