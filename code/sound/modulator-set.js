// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/5268512/Sound-Builder

class ModulatorSet {

    #implementation = { isFmEnabled: true, isAmEnabled: true };

    constructor(audioContext, soundSourceFrequency) {
        if (audioContext)
            this.context = audioContext;
        this.#implementation.soundSourceFrequency == soundSourceFrequency; // undefined for absolute-frequency modulator
        this.#implementation.frequencyModulatorList = [];
        this.#implementation.amplitudeModulatorList = [];
        this.#implementation.populate = (modulatorList, masterDepthMode, modulationData) => {
            if (masterDepthMode)
                masterDepthMode.gain.value = modulationData.masterDepth;
            for (let modulator of modulatorList)
                modulator.disconnect();
            modulatorList.splice(0);
            for (let dataElement of modulationData.modes) {
                let frequency = dataElement.frequency;
                if (soundSourceFrequency)
                    frequency *= soundSourceFrequency;
                const modulator = new Modulator(this.context);  
                modulator.depth = dataElement.depth;
                modulator.frequency = dataElement.frequency;
                modulatorList.push(modulator);
            } //loop
        } //this.#implementation.populate
        this.#implementation.baseDeactivate = _ => {
            for (let modulator of this.#implementation.frequencyModulatorList) {
                modulator.disconnect();
                modulator.deactivate();
            } //loop
        }; //baseDeactivate
    } //constructor

    // interface:

    set frequencyModulationData(dataset) {
        this.#implementation.populate(this.#implementation.frequencyModulatorList, this.#implementation.frequencyModulatatioMasterDepth, dataset);
    } //set frequencyModulationData
    set amplitudeModulationData(dataset) {
        this.#implementation.populate(this.#implementation.amplitudeModulatorList, this.#implementation.amplitudeModulatatioMasterDepth, dataset); 
    } //set amplitudeModulationData

    connectToAudioParameters(frequencyAudioParameter, amplitudeAudioParameter) {
        this.#implementation.frequencyAudioParameter = frequencyAudioParameter;
        this.#implementation.amplitudeAudioParameter = amplitudeAudioParameter;
        const connectTo = (list, masterDepthMode, audioParameter) => {
            for (let modulator of list)
                modulator.connect(masterDepthMode);
            masterDepthMode.connect(audioParameter);
        } //connectTo
        if (frequencyAudioParameter) {
            if (!this.#implementation.frequencyModulatatioMasterDepth)
                this.#implementation.frequencyModulatatioMasterDepth = new GainNode(this.context, { gain: 1 });
            connectTo(this.#implementation.frequencyModulatorList, this.#implementation.frequencyModulatatioMasterDepth, frequencyAudioParameter);    
        } //if
        if (amplitudeAudioParameter) {
            if (!this.#implementation.amplitudeModulatatioMasterDepth)
                this.#implementation.amplitudeModulatatioMasterDepth = new GainNode(this.context, { gain: 1 });
            connectTo(this.#implementation.amplitudeModulatorList, this.#implementation.amplitudeModulatatioMasterDepth, amplitudeAudioParameter);
        } //if
    } //connectToAudioParameters

    set frequencyModulationEnable(enable) {
        if (!enable || !this.#implementation.preservedFmMasterGain)
            this.#implementation.preservedFmMasterGain = this.#implementation.frequencyModulatatioMasterDepth.gain.value;
        this.#implementation.frequencyModulatatioMasterDepth.gain.value = enable ? this.#implementation.preservedFmMasterGain : 0;
    } //set frequencyModulationEnable
    get frequencyModulationEnable() { return this.#implementation.isFmEnabled; }
    
    set amplitudeModulationEnable(enable) {
        if (!enable || !this.#implementation.preservedAmMasterGain)
            this.#implementation.preservedAmMasterGain = this.#implementation.amplitudeModulatatioMasterDepth.gain.value;
        this.#implementation.amplitudeModulatatioMasterDepth.gain.value = enable ? this.#implementation.preservedAmMasterGain : 0;
    } //set amplitudeModulationEnable
    get amplitudeModulationEnable() { return this.#implementation.isAmEnabled; }

    baseDeactivate() { this.#implementation.baseDeactivate(); }

} //class ModulatorSet
