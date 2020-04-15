"use strict";

window.onload = () => {

    if (!goodJavaScriptEngine) {
        const title = `This application requires JavaScript engine better conforming to the standard`; 
        alert(title);
        const advice = `Browsers based on V8 engine are recommended, such as Chromium, Chrome, Opera, Vivaldi, Microsoft Edge v. 80.0.361.111 or later, and more`;
        document.body.innerHTML = `<h1>${title}.<br/><br/>${advice}&hellip;</h1><br/>`; // last <br/> facilitates selection (enabled)
        return;
    } //goodJavaScriptEngine

    const controls = findControls();
    
    controls.keyboard.isVisible = false;
    controls.usage.FitKeyboard.handler = value => controls.keyboard.fitView = value;
    
    controls.keyboard.isVisible = false;
    const synthesizer = new Synthesizer(controls.keyboard.first, controls.keyboard.last, controls.keyboard.firstFrequency, controls.keyboard.tonalSystem);
    controls.keyboard.setAction((down, index) => {
        synthesizer.Play(down, index);
    }); //kbd.setAction
    
    controls.usage.Filter.handler = value => synthesizer.IsFilterUsed = value;
    controls.playControl.sustain.onchange = (self, value) => synthesizer.Sustain = value;
    controls.playControl.volume.onchange = (self, value) => synthesizer.Volume = value;
            
    const singleton = {
        model: undefined,
        lastFileName: undefined,
        modelToView: function() {
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
        vewToModel: function() {
            this.model =  {
                header: {
                    format: DefinitionSet.title,
                    version: DefinitionSet.version,
                    formatVersion: DefinitionSet.formatVersion,
                    author: "",
                    instrumentName: controls.fileIO.instrumentName.value,
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
        const apply = () => {
            clearException();
            singleton.vewToModel();
            synthesizer.data = singleton.model;
            controls.fileIO.buttonApply.disabled = true;
        }; //appy
        apply();
        const onChangeHanler = () => { controls.fileIO.buttonApply.disabled = false; clearException(); };
        controls.fileIO.buttonApply.disabled = true;
        controls.fileIO.instrumentName.onkeydown = onChangeHanler;
        for (let index in controls.tables)
            controls.tables[index].onchange = onChangeHanler; 
        controls.fileIO.inputFile.onchange = (ev) => {
            const file = ev.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (readEvent) => {
                clearException();
                try {
                    const text = readEvent.target.result;
                    singleton.model = JSON.parse(text);
                } catch (ex) {
                    setExceptionMessage(`Error loading file: ${ex.message}`);
                    return;
                } //exception
                singleton.modelToView();
                setTimeout(() => apply(), 0);
            }; //reader.onload
            reader.readAsText(file);
            singleton.lastFileName = file.name; 
        };
        controls.fileIO.buttonLoad.onclick = event => {
            clearException();
            controls.fileIO.inputFile.value = null;
            controls.fileIO.inputFile.click();
        }; //controls.fileIO.buttonLoad.onclick
        controls.fileIO.buttonApply.onclick = event => apply();
        controls.fileIO.buttonStore.onclick = (ev) => {
            clearException();
            const link = document.createElement('a');
            apply();
            link.href = `${DefinitionSet.FileStorage.linkHrefMime},${JSON.stringify(singleton.model, null, DefinitionSet.FileStorage.tabSizeJSON)}`;
            if (!singleton.lastFileName)
                link.download = DefinitionSet.FileStorage.initialFileName;
            else
                link.download = singleton.lastFileName; 
            document.body.appendChild(link);    
            link.click();
        }; //controls.fileIO.buttonStore.onclick
    })(); //setup IO
    
    controls.keyboard.isVisible = true;
    controls.usage.FitKeyboard.focus();

    controls.copyright.innerHTML = DefinitionSet.copyright;
    controls.copyright.title = `${DefinitionSet.title} v.${DefinitionSet.version}`;

}; //window.onload
