class Instrument extends ModulatorSet {

    #implementation = { sustain: soundDefinitionSet.playControl.minimalSustain, gainCompensation: { }, transposition: 0 };

    constructor(frequencySet, tonalSystem) { // frequencySet = { first, last, startingFrequency }
        super();
        const isFrequencySetArray = frequencySet.constructor == Array
        if (isFrequencySetArray && !tonalSystem)
            tonalSystem = frequencySet.length;
        this.#implementation.tones = new Map();
        const context = new AudioContext();
        this.context = context;
        this.#implementation.compensationMasterGainNode = new GainNode(context, { gain: 1 });
        this.#implementation.masterGain = new GainNode(context, { gain: 1 });
        //compensation:
        const compensation = (() => {
            const compensation = (f) => {
                if (!this.#implementation.gainCompensation || !this.#implementation.gainCompensation.middleFrequency) return 1;
                const shift = f - this.#implementation.gainCompensation.middleFrequency;
                const g0 = this.#implementation.gainCompensation.lowFrequencyCompensationGain;
                const g1 = this.#implementation.gainCompensation.highFrequencyCompensationGain;
                const f0 = this.#implementation.gainCompensation.lowFrequency;
                const f1 = this.#implementation.gainCompensation.lowFrequency;
                const factor0 = (g0 - 1) / Math.pow(f0 - this.#implementation.gainCompensation.middleFrequency, 2);
                const factor1 = (g1 - 1) / Math.pow(f1 - this.#implementation.gainCompensation.middleFrequency, 2);
                if (shift < 0)
                    return 1 + factor0 * Math.pow(shift, 2);
                else                
                    return 1 + factor1 * Math.pow(shift, 2);
            } //compensation
            return compensation;
        })(); //setupGain
        this.#implementation.compensateToneGains = () => {
            for (let [_, tone] of this.#implementation.tones)
                tone.gainCompensation = compensation(tone.frequency); 
        }; //this.#implementation.compensateToneGains
        if (isFrequencySetArray) {
            let index = 0;
            for (let frequency of frequencySet) {
                const tone = new Tone(context, frequency, compensation(frequency));
                this.#implementation.tones.set(index, tone);
                tone.connect(this.#implementation.compensationMasterGainNode, 1);
                ++index;
            } //loop tones
        } else
            for (let index = frequencySet.first; index <= frequencySet.last; ++index) {
                const frequency = frequencySet.startingFrequency * Math.pow(2, index / tonalSystem);
                const tone = new Tone(context, frequency, compensation(frequency));
                this.#implementation.tones.set(index, tone);
                tone.connect(this.#implementation.compensationMasterGainNode, 1);
            } //loop tones
        this.#implementation.transpose = value => {
            this.#implementation.transposition = value;
            if (!this.#implementation.lastDataset) return;
            let index = 0;
            for (let [_, tone] of this.#implementation.tones) {
                const frequency = isFrequencySetArray ? frequencySet[index] * Math.pow(2, value / tonalSystem):
                    frequencySet.startingFrequency * Math.pow(2, (index + value) / tonalSystem);
                tone.transpose(frequency, compensation(frequency));
                ++index;
            } //loop
            this.data = this.#implementation.lastDataset;
        }; //this.#implementation.transpose
        this.#implementation.compensationMasterGainNode.connect(this.#implementation.masterGain);
        const oscillatorTypeFourier = soundDefinitionSet.OscillatorType.getValue(0).name; //default
        this.#implementation.setWaveform = (oscillator) => {
            let wave;
            if (!oscillator.type || oscillator.type == oscillatorTypeFourier) {
                const harmonics = oscillator.Fourier;
                const re = new Float32Array(harmonics.length + 1);
                const im = new Float32Array(harmonics.length + 1);
                re[0] = 0;
                im[0] = 0;
                for (let index in harmonics) {
                    const arrayIndex = parseInt(index) + 1;
                    const angle = harmonics[index].phase * Math.PI / 180;
                    re[arrayIndex] = harmonics[index].amplitude * Math.cos(angle) / 100; 
                    im[arrayIndex] = harmonics[index].amplitude * Math.sin(angle) / 100; 
                } //loop
                wave = context.createPeriodicWave(re, im);
            } else
                wave = oscillator.type;
            for (let [_, tone] of this.#implementation.tones)
                tone.waveform = wave;    
        } //this.#implementation.setWaveform
        this.#implementation.filterChain = new ChainNode(this.#implementation.masterGain, context.destination);
        this.#implementation.setFilterUsage = enable => this.#implementation.filterChain.isEnabled = enable;
        this.#implementation.setGainCompensation = (gainCompensation, saveValues) => {
            this.#implementation.gainCompensation = gainCompensation;
            this.#implementation.compensationMasterGainNode.gain.value = gainCompensation.masterGain;
            this.#implementation.compensateToneGains();
            if (saveValues)
                this.#implementation.savedGainCompensationValues = gainCompensation;
        } //this.#implementation.setGainCompensation
        this.#implementation.setGainCompensationUsage = enable => {
            if (enable && this.#implementation.savedGainCompensationValues)
                this.#implementation.setGainCompensation(this.#implementation.savedGainCompensationValues, false);
            else // now disable:
                this.#implementation.setGainCompensation(defaultInstrument.gainCompensation, false);
        }; //this.#implementation.setGainCompensationUsage
        this.#implementation.setFilterChain = filterData => {
            const filterSet = [];
            for (let filterElement of filterData) {
                if (!filterElement.present) continue;
                const filter = new BiquadFilterNode(context);
                filterSet.push(filter);
                filter.type = filterElement.type;
                filter.frequency.value = filterElement.frequency;
                if (filterElement.Q != undefined) filter.Q.value = filterElement.Q;
                if (filterElement.gain != undefined) filter.gain.value = filterElement.gain;
            } //loop
            this.#implementation.filterChain.populate(filterSet);
        } //this.#implementation.setFilterChain
        this.#implementation.setFilterChain(soundDefinitionSet.defaultFilterSet);
        this.#implementation.deactivate = _ => {
            for (let [_, tone] of this.#implementation.tones)
                tone.deactivate();
            super.baseDeactivate();
            this.#implementation.filterChain.deactivate();
            this.#implementation.compensationMasterGainNode.disconnect();
            this.#implementation.masterGain.disconnect();
        }; //this.#implementation.deactivate
    } //constructor

    play(on, index) { this.#implementation.tones.get(index).play(on); }

    playWith(usage, enable) {
        switch (usage) {
            case soundDefinitionSet.playControl.usage.frequencyModulation:
                for (let [_, tone] of this.#implementation.tones)
                    tone.frequencyModulationEnable = enable;
                return;
            case soundDefinitionSet.playControl.usage.amplitudeModulation:
                for (let [_, tone] of this.#implementation.tones)
                    tone.amplitudeModulationEnable = enable;
                return;
            case soundDefinitionSet.playControl.usage.gainEnvelope:
                for (let [_, tone] of this.#implementation.tones)
                    tone.gainEnvelopeEnable = enable;
                return;
            case soundDefinitionSet.playControl.usage.detuneEnvelope:
                for (let [_, tone] of this.#implementation.tones)
                    tone.detuneEnvelopeEnable = enable;
                return;
            case soundDefinitionSet.playControl.usage.frequencyModulationEnvelope:
                for (let [_, tone] of this.#implementation.tones)
                    tone.frequencyModulationEnvelopeEnable = enable;
                return;
            case soundDefinitionSet.playControl.usage.amplitudeModulationEnvelope:
                for (let [_, tone] of this.#implementation.tones)
                    tone.amplitudeModulationEnvelopeEnable = enable;
                return;
            case soundDefinitionSet.playControl.usage.filters: return this.#implementation.setFilterUsage(enable);
            case soundDefinitionSet.playControl.usage.gainCompensation: return this.#implementation.setGainCompensationUsage(enable);
            default: return;
        } //switch
    } //playWith

    set data(dataset) {
        this.#implementation.lastDataset = dataset;
        if (dataset.gainCompensation && dataset.gainCompensation.middleFrequency)
            this.#implementation.setGainCompensation(dataset.gainCompensation, true);
        this.#implementation.setWaveform(dataset.oscillator);
        for (let [_, tone] of this.#implementation.tones) {
            tone.gainEnvelope = dataset.gainEnvelope;    
            tone.detuneEnvelope = dataset.detuneEnvelope;    
        } //loop
        super.frequencyModulationData = dataset.frequencyModulation.absoluteFrequency;
        super.amplitudeModulationData = dataset.amplitudeModulation.absoluteFrequency;
        for (let [_, tone] of this.#implementation.tones) {
            tone.data = dataset;
            tone.frequencyModulationData = dataset.frequencyModulation.relativeFrequency;
            tone.amplitudeModulationData = dataset.amplitudeModulation.relativeFrequency;
            tone.connectToAudioParameters(tone.frequencyModulatorTarget, tone.amplitudeModulatorTarget);
            super.connectToAudioParameters(tone.frequencyModulatorTarget, tone.amplitudeModulatorTarget);
        } //loop
        this.#implementation.setFilterChain(dataset.filter);
    } //set data

    get volume() { return this.#implementation.masterGain.gain.value; }
    set volume(value) { this.#implementation.masterGain.gain.value = value; }

    get sustain() { return this.#implementation.sustain; }
    set sustain(value) {
        for (let [_, tone] of this.#implementation.tones)
            tone.sustain = value;
        this.#implementation.sustain = value;
    } //set sustain

    get frequencies() {
        const result = [];
        for (let [_, tone] of this.#implementation.tones)
            result.push(Math.round(tone.frequency * 10) / 10);
        return result;
    } //get frequencies

    get transposition() { return this.#implementation.value; }
    set transposition(value) { this.#implementation.transpose(value); }

    deactivate() { this.#implementation.deactivate(); }

} //class Instrument
