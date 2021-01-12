// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard

"use strict";

const settings = () => {

    const elements = {
        copyright: {
            spanYears: document.getElementById("years"),
            spanVersion: document.getElementById("version")
        },
        keyboard: document.getElementById("keyboard"),
        invitation: document.getElementById("invitation"),
        buttonShowChordTable: document.getElementById("button-show-chord-table"),
        showOptions: {
            optionUseComputerKeyboard: document.getElementById("checkbox-use-computer-keyboard"),
            optionHighlightChords: document.getElementById("checkbox-option-highlight-chords"),
            optionShowChordNotes: document.getElementById("checkbox-option-chord-notes")
        },
        radioTet: {
            radio12et: document.getElementById("radio-12-et"),
            radio12etJanko: document.getElementById("radio-12-et-Janko"),
            radio19et: document.getElementById("radio-19-et"),
            radio29et: document.getElementById("radio-29-et"),
            radio31et: document.getElementById("radio-31-et"),
        },
        controls: {
            instrument: document.getElementById("control-instrument"),
            volume: document.getElementById("control-volume"),
            volumeIndicator: document.getElementById("control-volume-value"),
            transposition: document.getElementById("control-transposition"),
            transpositionIndicator: document.getElementById("control-transposition-value"),
            reset: document.getElementById("control-reset")
        },
        legend19et: document.getElementById("radio-19-et-legend"),
        legend29et: document.getElementById("radio-29-et-legend"),
        legend31et: document.getElementById("radio-31-et-legend"),
        chordSet: [
            {
                toneCount: 12,
                table: document.getElementById("tet12-chord-table"),
                buildButton: document.getElementById("tet12-chord-build"),
                resetButton: document.getElementById("tet12-chord-reset"),
                closeButton: document.getElementById("tet12-chord-close")
            },
            {
                toneCount: 19,
                table: document.getElementById("tet19-chord-table"),
                buildButton: document.getElementById("tet19-chord-build"),
                resetButton: document.getElementById("tet19-chord-reset"),
                closeButton: document.getElementById("tet19-chord-close")
            },
            {
                toneCount: 31,
                table: document.getElementById("tet31-chord-table"),
                buildButton: document.getElementById("tet31-chord-build"),
                resetButton: document.getElementById("tet31-chord-reset"),
                closeButton: document.getElementById("tet31-chord-close")
            }  
        ]
    }; //elements
    
    (function associateChordTables() {
        elements.radioTet.radio12et.chordTable = elements.chordSet[0].table;
        elements.radioTet.radio12etJanko.chordTable = elements.chordSet[0].table;
        elements.radioTet.radio19et.chordTable = elements.chordSet[1].table;
        elements.radioTet.radio29et.chordTable = elements.chordSet[2].table;
        elements.radioTet.radio31et.chordTable = elements.chordSet[2].table;
    })();
    
    const notes = {
        tet31: {
            names: [
                "C", "D♭²", "C♯", "D♭", "C♯²",
                "D", "E♭²", "D♯", "E♭", "D♯²",
                "E", "F♭¹", "E♯¹",
                "F", "G♭²", "F♯", "G♭", "F♯²",
                "G", "A♭²", "G♯", "A♭", "G♯²",
                "A", "B♭²", "A♯", "B♭", "A♯²",
                "B", "C♭¹", "B♯¹"],
            shiftA: 23,
            bigRowIncrement: 18,
            smallRowIncrement: 13,
            rightIncrement: 5
        },
        tet29: {
            names: [
                "C", "D♭²", "C♯", "D♭", "C♯²",
                "D", "E♭²", "D♯", "E♭", "D♯²",
                "E", "ef", "F", "G♭²", "F♯", "G♭", "F♯²",
                "G", "A♭²", "G♯", "A♭", "G♯²",
                "A", "B♭²", "A♯", "B♭", "A♯²",
                "B", "bc"],
            shiftA: 22,
            bigRowIncrement: 17,
            smallRowIncrement: 12,
            rightIncrement: 5
        },
        tet19: {
            names: [
                "C", "C♯", "D♭",
                "D", "D♯", "E♭",
                "E", "ef", // E♯ == F♭
                "F", "F♯", "G♭",
                "G", "G♯", "A♭",
                "A", "A♯", "B♭",
                "B", "bc"], //B♯ == C♭
            shiftA: 14,
            bigRowIncrement: 11,
            smallRowIncrement: 8,
            rightIncrement: 3
        },
        tet12: {
            names: ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "B♯", "B"],
            shiftA: 9,
            bigRowIncrement: 7,
            smallRowIncrement: 5,
            rightIncrement: 2
        },
        tet12Janko: {
            shiftA: 9,
            bigRowIncrement: 13,
            smallRowIncrement: -1,
            rightIncrement: 2        
        }
    }; //notation
    notes.tet12Janko.names = notes.tet12.names;
    
    const options = {
        keyboardSize: {
            // verticalSizeFactor: 5,         
            // horizontalSizeFactor: 17,
            verticalSizeFactor: 3,         
            horizontalSizeFactor: 12,
            // do not assign here: 
            rows: 0, // definitionSet.keyboardSize.rows = 2 * definitionSet.keyboardSize.horizontalSizeFactor + 1
            longRowWidth: 0 // definitionSet.keyboardSize.longRowWidth = 2 * definitionSet.keyboardSize.horizontalSizeFactor + 1
        },
        keyboard: {
            width: 128,
            //relative to width:
            margins: 0.008,
            keyRadius: 0.0032,
            strokeWidth: 0.001
        },
        label: { fontSize: 0.28, paddingLeft: 0.25, paddingTop: 0.1 }, // relative to key size
        audibleMiddle: { note: "C", midiNote: 60, frequency: 261.625 },
        keyStroke: "#a1b0c7", // navy paint, "Haze gray and underway"
        highlightSound: "#ffd0a0",
        highlightChordNote: "yellow",
        highlightDefault: "white",
        highlightHardwareKey: "lightGreen",
        highlightChord: "yellow",
        labelFontFamily: "sans-serif",
        blockerFill: "#a1b0c7" // navy paint, "Haze gray and underway" 
    }; //options
    
    ( () => {
        options.keyboardSize.rows = 2 * options.keyboardSize.verticalSizeFactor + 1;
        options.keyboardSize.longRowWidth = 2 * options.keyboardSize.horizontalSizeFactor + 1;
    })();

    return setReadonly({ elements: elements, notes: notes, options: options, standardA: 27.5 }, true);

}; //settings
