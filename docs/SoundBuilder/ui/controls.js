"use strict";

const findControls = () => {

    const usage = (function defineButtons() {
        const stateButtonElements = document.querySelectorAll("header button");
        const stateButtons = [];
        for (let button of  stateButtonElements)
            stateButtons.push(new TwoStateButton(button));
        stateButtons[0].isDown = false;
        return {
            FitKeyboard: stateButtons[0], FM: stateButtons[1], AM: stateButtons[2],
            GainEnvelope: stateButtons[3], DetuneEnvelope: stateButtons[4], FMEnvelope: stateButtons[5], AMEnvelope: stateButtons[6],
            Filter: stateButtons[7],
            Sustain: new TwoStateButton(document.querySelector("#sound-control button")),
        };
    })(); // usage

    const parentVolume = document.querySelector("#sound-control div");
    const parentSustain = document.querySelector("#sound-control div:last-child");

    return {
        copyright: document.querySelector("footer small"),
        keyboard: ScrollableKeyboard.makeGrandPiano(document.querySelector("section.keyboard")),
        usage: usage,
        exception: document.querySelector("footer p:nth-child(2)"),
        playControl: {
            globalStartButtonParent: document.querySelector("#initialize-system"),
            hiddenBeforeStart:
                [
                    document.querySelector("header"),
                    document.querySelector("footer"),
                    document.querySelector("article"),
                ],
            globalStartButton: document.querySelector("#initialize-system > button"),
            volume: new Slider({ value: 1, min: 0, max: 1, step: 0.01, indicatorWidth: "2.5em" }, parentVolume),
            sustain: new Slider({ value: 0, min: DefinitionSet.PlayControl.minimalSustain, max: 1, step: 0.01, indicatorWidth: "3.2em", indicatorSuffix: " s" }, parentSustain),
        },
        tables: {
            tableFourier: new FourierTable(
                document.querySelector("#aspect-oscillator > table"),
                document.querySelector("#aspect-oscillator p select")),
            fmModulationAbsolute: new ModulationTable(
                document.querySelector("#aspect-fm-absolute > table"),
                { isRelative: false, slider: document.querySelector("#aspect-fm-absolute div") }
            ),
            fmModulationRelative: new ModulationTable(
                document.querySelector("#aspect-fm-relative > table"),
                { isRelative: true, slider: document.querySelector("#aspect-fm-relative div") }
            ),
            amModulationAbsolute: new ModulationTable(
                document.querySelector("#aspect-am-absolute > table"),
                { isRelative: false, slider: document.querySelector("#aspect-am-absolute div") }
            ),
            amModulationRelative: new ModulationTable(
                document.querySelector("#aspect-am-relative > table"),
                { isRelative: true, slider: document.querySelector("#aspect-am-relative div")  }
            ),
            gainEnvelope: new EnvelopeTable(
                document.querySelector("#aspect-gain-envelope > table"),
                { minGain: 0, maxGain: 1, gainSuffix: "", dampingSustainParent: document.querySelector("#aspect-gain-envelope div") }),
            detuneEnvelope: new EnvelopeTable(
                document.querySelector("#aspect-detune-envelope > table"),
                { minGain: -100, maxGain: 100, gainSuffix: ` ${String.fromCodePoint(0xA2)}`, dampingSustainParent: document.querySelector("#aspect-detune-envelope div") }),
            fmEnvelope: new EnvelopeTable(
                document.querySelector("#aspect-fm-envelope > table"),
                { minGain: 0, maxGain: 1, dampingSustainParent: document.querySelector("#aspect-fm-envelope div") }),
            amEnvelope: new EnvelopeTable(
                document.querySelector("#aspect-am-envelope > table"),
                { minGain: 0, maxGain: 1, dampingSustainParent: document.querySelector("#aspect-am-envelope div") }),
            filter: new Filter(document.querySelector("#aspect-filter > table")),
            compensation: {
                masterGain: new Slider({ value: 400, min: 0, max: 10, step: 0.0001, indicatorWidth: "4.5em" },
                    document.querySelector("#aspect-gain-compensation div")),
                middleFrequency: new Slider(
                    { value: 400, min: 20, max: 8000, step: 0.1, indicatorWidth: "4.5em", indicatorSuffix: " Hz" },
                    document.querySelector("#aspect-gain-compensation tr td:nth-child(1) div")),
                lowFrequencyCompensationGain: new Slider(
                    {value: 1, min: 0.0001, max: 100000, step: 0.00001, indicatorWidth: "6em"},
                    document.querySelector("#aspect-gain-compensation tr td:nth-child(2) div")),
                highFrequencyCompensationGain: new Slider(
                    {value: 1, min: 0.0001, max: 100000, step: 0.0001, indicatorWidth: "6em"},
                    document.querySelector("#aspect-gain-compensation tr td:nth-child(3) div")),
            },
        },
        fileIO: {
            instrumentName: document.querySelector("header aside p input"),
            buttonLoad: document.querySelector("footer button:first-child"),
            buttonApply: document.querySelector("footer div button:nth-child(2)"),
            buttonStore: document.querySelector("footer button:last-child"),
        },
        instrumentList: {
            list: document.querySelector("details:last-child section select"),
            add: document.querySelector("details:last-child button:first-of-type"),
            remove: document.querySelector("details:last-child button:nth-of-type(2)"),
            save: document.querySelector("details:last-child button:first-of-type"),
        },
    };

};
