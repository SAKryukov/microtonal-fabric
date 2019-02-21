// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2019
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard

"use strict";

const chordLayoutFinder = (function() {

    function ChordOptionSet() {
        this.highlightChords = true;
        this.showChordNotes = true;
        elements.showOptions.optionHighlightChords.optionSet = this;
        elements.showOptions.optionShowChordNotes.optionSet = this;
        elements.showOptions.optionHighlightChords.onclick = function(event) {
            this.optionSet.highlightChords = event.target.checked;
        }; //elements.showOptions.optionHighlightChords.onclick
        elements.showOptions.optionShowChordNotes.onclick = function(event) {
            this.optionSet.showChordNotes = event.target.checked;
        }; //elements.showOptions.optionShowChordNotes.onclick
    } //ChordOptionSet
    const chordOptionSet = new ChordOptionSet();
        
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

    function findChordNoteInRow(chordNote, row, stepX) {
        const leftmostNote = row[0].note;
        const distance = chordNote - leftmostNote; 
        if (distance < 0) return null;
        if (distance % stepX != 0) return null;
        const step = distance / stepX;
        return row[step];
    } //findChordNoteInRow

    function findChordNote(rootNoteKey, chordNote, stepX) {
        let bestNorm = Number.POSITIVE_INFINITY;
        let bestKey = null;
        for (let row of keyboardHandler.rows) {
            const key = findChordNoteInRow(chordNote, row, stepX);
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
        const notesInOctave = rootNote.toneSystem.names.length;
        const stepX = rootNote.toneSystem.rightIncrement;
        const result = [];
        const showChordNotes = chordOptionSet.showChordNotes;
        for (let chordElement of chord) {
            const key = findChordNote(
                rootNote,
                rootNote.note + chordElement.note + notesInOctave * chordElement.octave,
                stepX
            );
            if (!key) continue;
            const title = showChordNotes ? chordElement.title : null
            result.push({ key: key, title: title });
        } //loop
        result.highlightChords = chordOptionSet.highlightChords;
        return result;
    }; //this.find

    return find;

})();