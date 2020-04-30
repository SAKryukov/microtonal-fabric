"use strict";

const soundDefinitionSet = {

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
            gainCompensation: 128,
        }     
    },

} //class soundDefinitionSet
