"use strict";

const elements = {
    keyboard: document.getElementById("keyboard"),
    buttonShowChordTable: document.getElementById("button-show-chord-table"),
    radioTet: {
        radio12et: document.getElementById("radio-12-et"),
        radio12etJanko: document.getElementById("radio-12-et-Janko"),
        radio19et: document.getElementById("radio-19-et"),
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
        startingMidiNote: 0,
        bigRowIncrement: 18,
        smallRowIncrement: 13,
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
        startingMidiNote: 0,
        bigRowIncrement: 11,
        smallRowIncrement: 8,
        rightIncrement: 3
    },
    tet12: {
        names: ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "B♯", "B"],
        startingMidiNote: 0,
        bigRowIncrement: 7,
        smallRowIncrement: 5,
        rightIncrement: 2
    },
    tet12Janko: {
        startingMidiNote: 24,
        bigRowIncrement: 1,
        smallRowIncrement: -1,
        rightIncrement: 2        
    }
}; //notation
notes.tet12Janko.names = notes.tet12.names;

const definitionSet = {
    highlightSound: "#ffd0a0",
    highlightChordNote: "yellow",
    highlightDefault: "white",
    highlightHardwareKey: "lightGreen",
    highlightChord: "yellow",
    labelFontFamily: "sans-serif",
    hardwareKeyboardControl: {
        startingRow: 4,
        keyShift: 15,
    },
    presets: [
        { preset: webAudioFont00, title: "Piano" },
        { preset: webAudioFont14, title: "Bells" },
        { preset: webAudioFont16, title: "Organ" },
        { preset: webAudioFont24, title: "Guitar" },
        { preset: webAudioFont91, title: "Pad 4 Choir" },
        //"sine", "square", "sawtooth", "triangle":
        { preset: "sine", title: "Sine" },
        { preset: "square", title: "Square" },
        { preset: "sawtooth", title: "Saw Tooth" },
        { preset: "triangle", title: "Triangle" }
    ],
    defaultOctave: 0,
    defaultPreset: 2,
    minTransposition: -24,
    maxTransposition: +24,
    transpositionStep: 1,
    minVolume: 0,
    maxVolume: 1,
    volumeStep: 0.01
}; //definitionSet
