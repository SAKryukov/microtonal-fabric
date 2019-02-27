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

const commonSettings = () => {

    return {
        copyright: { version: "4.1", years: "2017-2019" },
        audibleMiddle: { note: "C", midiNote: 60, frequency: 261.625 },
        presets: [
            { preset: webAudioFont00, title: "Piano" },
            { preset: webAudioFont14, title: "Bells" },
            { preset: webAudioFont16, title: "Organ" },
            { preset: webAudioFont24, title: "Guitar" },
            { preset: webAudioFont91, title: "Pad 4 Choir" },
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
        initialVolume: 0.4,
        volumeStep: 0.01,
        initialTouchDynamicsDivider: 500
    };

}; //commonSettings
