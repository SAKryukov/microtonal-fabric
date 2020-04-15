"use strict";

const DefinitionSet = {

    version: "0.1.0",
    formatVersion: "2.0.0",
    title: "Sound Builder",
    copyright: "Copyright &copy; 2018-2020 by S A Kryukov",

    EnvelopeElementType: new Enumeration(["exponential", "linear", "Heaviside"]),
    OscillatorType: new Enumeration(["Fourier", "square", "sawtooth", "triangle"]),
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
    
    EnvelopeElementIndex: {
        exponential: 0,
        linear: 1,
        Heaviside: 2,
    }, //EnvelopeElement

    PlayControl: {
        minimalAttack: 0.02, 
        minimalSustain: 0.02,     
    },

    FileStorage: {
        linkHrefMime: "data:text/plain;charset=utf-8", 
        initialFileName: "instrument.json",
        tabSizeJSON: 4,     
    },

} //class DefinitionSet
