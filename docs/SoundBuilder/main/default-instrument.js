// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/5268512/Sound-Builder

const defaultInstrument = {
    gainCompensation: {
        masterGain: 1,
        middleFrequency: 329.628, // middle e', real middle key of the keyboard (#44), between middle C and middle A = 440 Hz
        lowFrequency: 27.5,
        lowFrequencyCompensationGain: 1,
        highFrequency: 3951.066410048994,
        highFrequencyCompensationGain: 1
    },
    oscillator: {
        type: "triangle",
        Fourier: [
        ]
    },
    gainEnvelope: {
        stages: [],
        dampingSustain: 0.02
    },
    detuneEnvelope: {
        stages: [],
        dampingSustain: 0.02
    },
    frequencyModulation: {
        absoluteFrequency: {
            masterDepth: 1,
            modes: []
        },
        relativeFrequency: {
            masterDepth: 1,
            modes: []
        },
        envelope: {
            stages: [],
            dampingSustain: 0.02
        }
    },
    amplitudeModulation: {
        absoluteFrequency: {
            masterDepth: 1,
            modes: []
        },
        relativeFrequency: {
            masterDepth: 1,
            modes: []
        },
        envelope: {
            stages: [],
            dampingSustain: 0.02
        }
    },
    filter: [
        {
            present: true,
            index: 0,
            type: "lowpass",
            frequency: 350,
            Q: 1
        },
        {
            present: false,
            index: 1,
            type: "highpass",
            frequency: 350,
            Q: 1
        },
        {
            present: false,
            index: 2,
            type: "bandpass",
            frequency: 350,
            Q: 1
        },
        {
            present: false,
            index: 3,
            type: "lowshelf",
            frequency: 350,
            gain: 1
        },
        {
            present: false,
            index: 4,
            type: "highshelf",
            frequency: 350,
            gain: 1
        },
        {
            present: false,
            index: 5,
            type: "peaking",
            frequency: 350,
            Q: 1,
            gain: 1
        },
        {
            present: false,
            index: 6,
            type: "notch",
            frequency: 350,
            Q: 1
        },
        {
            present: false,
            index: 7,
            type: "allpass",
            frequency: 350,
            Q: 1
        }
    ]
}