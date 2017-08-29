const elements = {
    keyboardSet: [
        {
            keyboard: document.getElementById("just-keyboard"),
            chordActivator: document.getElementById("just-chord-activator"),
            chordTable: document.getElementById("just-chord-table"),            
            title: "Just Intonation",
            tones: [
                1 / 1, //C
                9 / 8, //D
                5 / 4, //E
                4 / 3, //F
                3 / 2, //G
                5 / 3, //A
                15 / 8 //B
            ]
        },
        {
            keyboard: document.getElementById("tet-12-keyboard"),
            chordActivator: document.getElementById("tet-12-chord-activator"),
            chordTable: document.getElementById("tet12-chord-table"),            
            title: "12-TET"
        },
        {
            keyboard: document.getElementById("tet-19-keyboard"),
            chordActivator: document.getElementById("tet-19-chord-activator"),
            chordTable: document.getElementById("tet19-chord-table"),            
            title: "19-TET"
        },
        {
            keyboard: document.getElementById("tet-31-keyboard"),
            chordActivator: document.getElementById("tet-31-chord-activator"),
            chordTable: document.getElementById("tet31-chord-table"),            
            title: "31-TET"
        }
    ],
    controls: {
        comparer: document.getElementById("comparer-main"),
        comparerLeft: document.getElementById("comparer-left"),
        comparerRight: document.getElementById("comparer-right"),
        instrument: document.getElementById("control-instrument"),
        volume: document.getElementById("control-volume"),
        volumeIndicator: document.getElementById("control-volume-value"),
        transposition: document.getElementById("control-transposition"),
        transpositionIndicator: document.getElementById("control-transposition-value"),
        reset: document.getElementById("control-reset")
    }
}; //elements

const definitionSet = {
    highlightSound: "#ffd0a0",
    highlightChordNote: "yellow",
    highlightDefault: "white",
    highlightChord: "yellow",
    highlightComparer: "lightGreen",
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
    defaultOctave: 4, // one octave lower than "middle C"
    defaultPreset: 2,
    minTransposition: -12,
    maxTransposition: +12,
    transpositionStep: 1,
    minVolume: 0,
    maxVolume: 1,
    volumeStep: 0.01
}; //definitionSet
