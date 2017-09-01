"use strict";

const chordLayoutFinder = (function() {

    (function setup() {
        keyboardHandler.rows.iterateKeys(function(key) {
            key.rectangle.getAttributeNS(null, "x");
            key.location = { x: key.rectangle.getAttributeNS(null, "x"), y: key.rectangle.getAttributeNS(null, "y") };
        });
    })(); //setup

    function norm(oneKey, anotherKey) {
        const deltaX = oneKey.location.x - anotherKey.location.x;
        const deltaY = oneKey.location.y - anotherKey.location.y;
        return deltaX * deltaX + deltaY * deltaY; 
    } //norm

    function findChordNoteInRow(chordNote, row) {
        const leftmostNote = row[0].note;
        const distance = chordNote - leftmostNote; 
        if (distance < 0) return null;
        const delta = row[1].note - leftmostNote;
        if (distance % delta != 0) return null;
        const step = distance / delta;
        return row[step];
    } //findChordNoteInRow

    function findChordNote(rootNoteKey, chordNote) {
        let bestNorm = Number.POSITIVE_INFINITY;
        let bestKey = null;
        for (let row of keyboardHandler.rows) {
            const key = findChordNoteInRow(chordNote, row);
            if (!key) continue;
            const normValue = norm(rootNoteKey, key);
            if (normValue < bestNorm) {
                bestKey = key;
                bestNorm = normValue;
            } //if
        } //loop
        return bestKey;
    } //findChordNote

    const find = function(rootNote, chord) {
        const result = [];
        for (let chordElement of chord) {
            const key = findChordNote(rootNote, rootNote.note + chordElement.note);
            if (!key) continue;
            result.push({ key: key, title: chordElement.title });
        } //loop
        return result;
    }; //this.find

    return find;

})();