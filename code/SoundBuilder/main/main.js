// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

window.onload = () => {

    if (initializationController.badJavaScriptEngine()) return;
    const controls = findControls();
    initializationController.initialize(
        controls.playControl.hiddenBeforeStart,
        controls.playControl.globalStartButton,
        controls.playControl.globalStartButtonParent,
        startApplication
    );
    metadata.initialize(controls.copyright);
    controls.playControl.globalStartButton.focus();

    function startApplication() {

        const keyboardProperties = (() => {
            const result = {
                first: controls.keyboard.first,
                last: controls.keyboard.last,
                firstFrequency: controls.keyboard.firstFrequency,
                tonalSystem: controls.keyboard.tonalSystem,
            };
            result.lastFrequency = result.firstFrequency * Math.pow(2, result.last / result.tonalSystem);
            return result;
        })(); //keyboardProperties

        const instrument = new Instrument(
            { first: keyboardProperties.first, last: keyboardProperties.last, startingFrequency: keyboardProperties.firstFrequency },
                keyboardProperties.tonalSystem);
            controls.keyboard.setAction((down, index) => {
            instrument.play(down, index);
        }); //kbd.setAction
        controls.keyboard.showFrequencies(instrument.frequencies, "\n\nKey frequency:", "Hz");

        controls.usage.FitKeyboard.handler = value => controls.keyboard.fitView = value;

        (function setupPlayControl() {
            const setSustain = () =>
                instrument.sustain = controls.playControl.sustain.disabled ? undefined : controls.playControl.sustain.value; 
            controls.playControl.sustain.onchange = (self, value) => setSustain();
            controls.playControl.volume.onchange = (self, value) => instrument.volume = value;
            // usage:
            controls.usage.FM.handler = value => instrument.playWith(soundDefinitionSet.playControl.usage.frequencyModulation, value);
            controls.usage.AM.handler = value => instrument.playWith(soundDefinitionSet.playControl.usage.amplitudeModulation, value);
            controls.usage.GainEnvelope.handler = value => instrument.playWith(soundDefinitionSet.playControl.usage.gainEnvelope, value);
            controls.usage.DetuneEnvelope.handler = value => instrument.playWith(soundDefinitionSet.playControl.usage.detuneEnvelope, value);
            controls.usage.FMEnvelope.handler = value => instrument.playWith(soundDefinitionSet.playControl.usage.frequencyModulationEnvelope, value);
            controls.usage.AMEnvelope.handler = value => instrument.playWith(soundDefinitionSet.playControl.usage.amplitudeModulationEnvelope, value);
            controls.usage.Filter.handler = value => instrument.playWith(soundDefinitionSet.playControl.usage.filters, value);
            controls.usage.GainCompensation.handler = value => instrument.playWith(soundDefinitionSet.playControl.usage.gainCompensation, value);
            controls.usage.Sustain.handler = value => {
                controls.playControl.sustain.disabled = !value;
                setSustain();
            };    
        })(); //setupPlayControl

        setupGainCompensation(controls);

        const singleton = {
            model: undefined,
            lastFileName: undefined,
            modelToView: function () {
                if (this.model.gainCompensation && this.model.gainCompensation.middleFrequency != undefined) {
                    controls.tables.compensation.masterGain.value = this.model.gainCompensation.masterGain;
                    controls.tables.compensation.middleFrequency.value = this.model.gainCompensation.middleFrequency;
                    controls.tables.compensation.lowFrequencyCompensationGain.value = this.model.gainCompensation.lowFrequencyCompensationGain;
                    controls.tables.compensation.highFrequencyCompensationGain.value = this.model.gainCompensation.highFrequencyCompensationGain;    
                } //if compensationGain
                controls.fileIO.instrumentName.value = this.model.header.instrumentName;
                controls.tables.tableFourier.data = this.model.oscillator;
                controls.tables.filter.data = this.model.filter;
                if (this.model.frequencyModulation) {
                    controls.tables.fmModulationAbsolute.data = this.model.frequencyModulation.absoluteFrequency;
                    controls.tables.fmModulationRelative.data = this.model.frequencyModulation.relativeFrequency;
                    controls.tables.fmEnvelope.data = this.model.frequencyModulation.envelope;
                } //if frequencyModulation
                if (this.model.amplitudeModulation) {
                    controls.tables.amModulationAbsolute.data = this.model.amplitudeModulation.absoluteFrequency;
                    controls.tables.amModulationRelative.data = this.model.amplitudeModulation.relativeFrequency;
                    controls.tables.amEnvelope.data = this.model.amplitudeModulation.envelope;
                } //if amplitudeModulation
                controls.tables.gainEnvelope.data = this.model.gainEnvelope;
                controls.tables.detuneEnvelope.data = this.model.detuneEnvelope;
            }, //modelToView
            createHeader: () => {
                return {
                    format: definitionSet.title,
                    version: sharedDefinitionSet.version,
                    formatVersion: definitionSet.formatVersion,
                    author: "",
                    instrumentName: controls.fileIO.instrumentName.value,
                }
            }, //createHeader
            viewToModel: function () {
                this.model = {
                    header: this.createHeader(),
                    gainCompensation: {
                        masterGain: controls.tables.compensation.masterGain.value,
                        middleFrequency: controls.tables.compensation.middleFrequency.value,
                        lowFrequency: keyboardProperties.firstFrequency,
                        lowFrequencyCompensationGain: controls.tables.compensation.lowFrequencyCompensationGain.value,
                        highFrequency: keyboardProperties.lastFrequency,
                        highFrequencyCompensationGain: controls.tables.compensation.highFrequencyCompensationGain.value,
                    },
                    oscillator: controls.tables.tableFourier.data,
                    gainEnvelope: controls.tables.gainEnvelope.data,
                    detuneEnvelope: controls.tables.detuneEnvelope.data,
                    frequencyModulation: {
                        absoluteFrequency: controls.tables.fmModulationAbsolute.data,
                        relativeFrequency: controls.tables.fmModulationRelative.data,
                        envelope: controls.tables.fmEnvelope.data,
                    },
                    amplitudeModulation: {
                        absoluteFrequency: controls.tables.amModulationAbsolute.data,
                        relativeFrequency: controls.tables.amModulationRelative.data,
                        envelope: controls.tables.amEnvelope.data,
                    },
                    filter: controls.tables.filter.data,
                }
            }, //viewToModel
        }; //singleton

        (function setupIO() {
            const setExceptionMessage = (exception, customPrefix, customTitle) => {
                const prefix = customPrefix ? `${customPrefix}: ` : "";
                controls.exception.textContent = exception ? `${prefix}${exception.message}` : "";
                controls.exception.title = customTitle;
            }; //setExceptionMessage
            const clearException = () => setExceptionMessage(undefined);
            const apply = fromView => {
                try {
                    clearException();
                    if (fromView)
                        singleton.viewToModel();
                    instrument.data = singleton.model;
                    controls.fileIO.buttonApply.disabled = true;    
                } catch (ex) {
                    setExceptionMessage(ex, "Failed to interpret instrument data, might need upgrade to newer format version");
                } //exception
            }; //apply
            (() => { // setup default instrument
                singleton.model = defaultInstrument;
                singleton.model.header = singleton.createHeader(); 
                singleton.modelToView();
                apply();    
            })();
            apply(true);
            const onChangeHandler = () => { controls.fileIO.buttonApply.disabled = false; clearException(); };
            controls.fileIO.buttonApply.disabled = true;
            controls.fileIO.instrumentName.onkeydown = onChangeHandler;
            for (let index in controls.tables)
                controls.tables[index].onchange = onChangeHandler;
            for (let index in controls.tables.compensation)
                controls.tables.compensation[index].onchange = onChangeHandler;
            //
            const loadModel = (fileName, text) => {
                clearException();
                try {
                    singleton.model = JSON.parse(text);
                    if (!singleton.model.header)
                        throw new Error(`header should be specified`);
                    const loadedFormatVersion = parseFloat(singleton.model.header.formatVersion);
                    if (Number.isNaN(loadedFormatVersion))
                        throw new Error(`invalid format version: "${singleton.model.header.formatVersion}"`);
                    const currentFormatVersion = parseFloat(definitionSet.formatVersion);
                    if ((currentFormatVersion >= loadedFormatVersion) != true) //sic!
                        throw new Error(
                            `File format version should be lower or equal to ${definitionSet.formatVersion}, ` +
                            `otherwise newer version of the application might be required`);
                } catch (ex) {
                    setExceptionMessage(ex, "Error loading file");
                    return;
                } //exception
                (() => { //resetTables:
                    for (let tableIndex in controls.tables)
                        if (controls.tables[tableIndex].reset)
                            controls.tables[tableIndex].reset();
                })();
                setTimeout(() => {
                    singleton.modelToView();
                    apply();
                });
                singleton.lastFileName = fileName;
            }; //loadModel
            const storeModel = () => {
                clearException();
                apply(true);
                const fileName = singleton.lastFileName ? singleton.lastFileName : definitionSet.fileStorage.initialInstrumentFileName;
                fileIO.storeFile(
                    fileName,
                    JSON.stringify(singleton.model, null, definitionSet.fileStorage.tabSizeJSON));
            }; //storeModel
            //
            controls.fileIO.buttonLoad.onclick = _ => {
                clearException();
                fileIO.loadTextFile(loadModel, ".json");
            }; //controls.fileIO.buttonLoad.onclick
            controls.fileIO.buttonApply.onclick = _ => apply(true);
            controls.fileIO.buttonStore.onclick = _ => storeModel();
            instrumentList.initialize(controls.instrumentList, setExceptionMessage, clearException);
        })(); //setup IO

        controls.usage.FitKeyboard.focus();

    } //startApplication
    
}; //window.onload
