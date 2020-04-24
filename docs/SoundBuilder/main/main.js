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
        const instrument = new Instrument(keyboardProperties.first, keyboardProperties.last, keyboardProperties.firstFrequency, keyboardProperties.tonalSystem);
        controls.keyboard.setAction((down, index) => {
            instrument.play(down, index);
        }); //kbd.setAction

        controls.usage.FitKeyboard.handler = value => controls.keyboard.fitView = value;

        (function setupPlayControl() {
            const setSustain = () =>
                instrument.sustain = controls.playControl.sustain.disabled ? undefined : controls.playControl.sustain.value; 
            controls.playControl.sustain.onchange = (self, value) => setSustain();
            controls.playControl.volume.onchange = (self, value) => instrument.volume = value;
            // usage:
            controls.usage.FM.handler = value => instrument.playWith(DefinitionSet.PlayControl.usage.frequencyModulation, value);
            controls.usage.AM.handler = value => instrument.playWith(DefinitionSet.PlayControl.usage.amplitudeModulation, value);
            controls.usage.GainEnvelope.handler = value => instrument.playWith(DefinitionSet.PlayControl.usage.gainEnvelope, value);
            controls.usage.DetuneEnvelope.handler = value => instrument.playWith(DefinitionSet.PlayControl.usage.detuneEnvelope, value);
            controls.usage.FMEnvelope.handler = value => instrument.playWith(DefinitionSet.PlayControl.usage.frequencyModulationEnvelope, value);
            controls.usage.AMEnvelope.handler = value => instrument.playWith(DefinitionSet.PlayControl.usage.amplitudeModulationEnvelope, value);
            controls.usage.Filter.handler = value => instrument.playWith(DefinitionSet.PlayControl.usage.filters, value);
            controls.usage.Sustain.handler = value => {
                controls.playControl.sustain.disabled = !value;
                setSustain();
            };    
        })(); //setupPlayControl

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
                    format: DefinitionSet.title,
                    version: DefinitionSet.version,
                    formatVersion: DefinitionSet.formatVersion,
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
            const setExceptionMessage = (msg, detail) => {
                controls.exception.textContent = msg; controls.exception.title = detail;
            }
            const clearException = () => setExceptionMessage(undefined);
            const apply = (fromView) => {
                clearException();
                if (fromView)
                    singleton.viewToModel();
                instrument.data = singleton.model;
                controls.fileIO.buttonApply.disabled = true;
            }; //appy
            (() => { // setup default instrument
                singleton.model = defaultInstrument;
                singleton.model.header = singleton.createHeader(); 
                singleton.modelToView();
                apply();    
            })();
            apply(true);
            const onChangeHanler = () => { controls.fileIO.buttonApply.disabled = false; clearException(); };
            controls.fileIO.buttonApply.disabled = true;
            controls.fileIO.instrumentName.onkeydown = onChangeHanler;
            for (let index in controls.tables)
                controls.tables[index].onchange = onChangeHanler;
            for (let index in controls.tables.compensation)
                controls.tables.compensation[index].onchange = onChangeHanler;
            controls.fileIO.inputFile.onchange = event => {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (readEvent) => {
                    clearException();
                    try {
                        const text = readEvent.target.result;
                        singleton.model = JSON.parse(text);
                        if (!singleton.model.header)
                            throw new Error(`header should be specified`);
                        const loadedFormatVersion = parseFloat(singleton.model.header.formatVersion);
                        if (Number.isNaN(loadedFormatVersion))
                            throw new Error(`invalid format version: "${singleton.model.header.formatVersion}"`);
                        const currentFormatVersion = parseFloat(DefinitionSet.formatVersion);
                        if ((currentFormatVersion >= loadedFormatVersion) != true) //sic!
                            throw new Error(
                                `File format version should be lower or equal to ${DefinitionSet.formatVersion}, ` +
                                `otherwise newer version of the application might be required`); 
                    } catch (ex) {
                        setExceptionMessage(`Error loading file: ${ex.message}`);
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
                }; //reader.onload
                reader.readAsText(file);
                singleton.lastFileName = file.name;
            }; //controls.fileIO.inputFile.onchange
            controls.fileIO.buttonLoad.onclick = _ => {
                clearException();
                controls.fileIO.inputFile.value = null;
                controls.fileIO.inputFile.click();
            }; //controls.fileIO.buttonLoad.onclick
            controls.fileIO.buttonApply.onclick = _ => apply(true);
            controls.fileIO.buttonStore.onclick = _ => {
                clearException();
                const link = document.createElement('a');
                apply(true);
                link.href = `${DefinitionSet.FileStorage.linkHrefMime},${JSON.stringify(singleton.model, null, DefinitionSet.FileStorage.tabSizeJSON)}`;
                if (!singleton.lastFileName)
                    link.download = DefinitionSet.FileStorage.initialFileName;
                else
                    link.download = singleton.lastFileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }; //controls.fileIO.buttonStore.onclick
            instrumentList.initialize(controls.instrumentList);
        })(); //setup IO

        //showAfterStart();
        controls.usage.FitKeyboard.focus();

        controls.copyright.innerHTML = DefinitionSet.copyright;
        controls.copyright.title = `${DefinitionSet.title} v.${DefinitionSet.version}`;

    } //startApplication
    
}; //window.onload
