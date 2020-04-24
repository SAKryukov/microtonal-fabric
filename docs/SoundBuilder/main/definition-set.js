"use strict";

const definitionSet = {

    version: "0.1.0",
    formatVersion: "3.1.0",
    title: "Sound Builder",
    copyright: "Copyright &copy; 2018-2020 by S A Kryukov",

    EnvelopeElementType: new Enumeration(["exponential", "linear", "Heaviside"]),
    OscillatorType: new Enumeration(["Fourier", "square", "sawtooth", "triangle"]), // "Fourier" should always come first, this is a default corresponding to Web Audio "custom" oscillator type
    FilterType: new Enumeration([
        { name: "lowpass", humanReadableName: "Low-pass" },
        { name: "highpass", humanReadableName: "High-pass" },
        { name: "bandpass", humanReadableName: "Band-pass" },
        { name: "lowshelf", humanReadableName: "Low-shelf" },
        { name: "highshelf", humanReadableName: "High-shelf" },
        { name: "peaking", humanReadableName: "Peaking" },
        { name: "notch", humanReadableName: "Notch" },
        { name: "allpass", humanReadableName: "All-pass" },
    ]),

    keyboardKeyColors: {
        background: "white",
        hightlight: "Chartreuse",
        border: "lightGray",
        label: "gray",
    },

    defaultFilterSet: [{
        present: true,
        index: 0,
        type: "lowpass",
        frequency: 350,
        Q: 1
    }],

    envelopeElementIndex: {
        exponential: 0,
        linear: 1,
        Heaviside: 2,
    }, //EnvelopeElement

    playControl: {
        minimalAttack: 0.02, 
        minimalSustain: 0.02,
        usage: {
            frequencyModulation: 1,
            amplitudeModulation: 2,
            gainEnvelope: 4,
            detuneEnvelope: 8,
            frequencyModulationEnvelope: 16,
            amplitudeModulationEnvelope: 32,
            filters: 64,
        }     
    },

    fileStorage: {
        initialInstrumentFileName: "instrument.json",
        initialInstrumentListFileName: "instrumentList.js",
        instrumentListFileObjectName: "instrumentList",
        tabSizeJSON: 4,     
    },

} //class definitionSet
