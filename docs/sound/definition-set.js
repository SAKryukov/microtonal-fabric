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

    noteNames: {
        edo31: [
                "C", "D♭²", "C♯", "D♭", "C♯²",
                "D", "E♭²", "D♯", "E♭", "D♯²",
                "E", "F♭¹", "E♯¹",
                "F", "G♭²", "F♯", "G♭", "F♯²",
                "G", "A♭²", "G♯", "A♭", "G♯²",
                "A", "B♭²", "A♯", "B♭", "A♯²",
                "B", "C♭¹", "B♯¹"],
        edo29: [
                "C", "D♭²", "C♯", "D♭", "C♯²",
                "D", "E♭²", "D♯", "E♭", "D♯²",
                "E", "ef", "F", "G♭²", "F♯", "G♭", "F♯²",
                "G", "A♭²", "G♯", "A♭", "G♯²",
                "A", "B♭²", "A♯", "B♭", "A♯²",
                "B", "bc"],
        edo19: [
                "C", "C♯", "D♭",
                "D", "D♯", "E♭",
                "E", "ef", // E♯ == F♭
                "F", "F♯", "G♭",
                "G", "G♯", "A♭",
                "A", "A♯", "B♭",
                "B", "bc"], //B♯ == C♭
        edo12: ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "B♯", "B"],
    },

}; //soundDefinitionSet
