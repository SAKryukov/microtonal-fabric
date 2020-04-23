class Instrument extends ModulatorSet {

    #implementation = {
        sustain: DefinitionSet.PlayControl.minimalSustain,
        gainCompensation: { middleFrequency: 400, lowFrequencyCompensationGain: 0.0001, highFrequencyCompensationGain: 130 }
    };

    constructor(first, last, firstFrequency, tonalSystem) {
        super();
        this.#implementation.tones = new Map();
        const context = new AudioContext();
        this.context = context;
        this.#implementation.compensationGainNode = new GainNode(context, { gain: 1 }); //SA??? SA!!! unused!
        this.#implementation.masterGain = new GainNode(context, { gain: 1 });
        //compensation:
        const compensation = (() => {
            const f0 = firstFrequency * Math.pow(2, first / tonalSystem);
            const f1 = firstFrequency * Math.pow(2, last / tonalSystem)
            const compensation = (f) => {
                if (!this.#implementation.gainCompensation.middleFrequency) return 1;
                const shift = this.#implementation.gainCompensation.middleFrequency;
                const ff = f - shift;
                const g0 = this.#implementation.gainCompensation.lowFrequencyCompensationGain;
                const g1 = this.#implementation.gainCompensation.highFrequencyCompensationGain;
                const p = (Math.log(g1) - Math.log(g0)) / (2.0 * (Math.log(f1) - Math.log(f0)));
                const loga = Math.log(g1) - (2.0 * p * Math.log(f1));
                const a = Math.exp(loga);
                return a * Math.pow(Math.pow(ff, 2), p) + 1.0;
            } //compensation
            return compensation;
        })(); //setupGain
        this.#implementation.compensateToneGains = () => {
            for (let [_, tone] of this.#implementation.tones)
                tone.gainCompensation = compensation(tone.frequency); 
        }; //this.#implementation.compensateToneGains
        for (let index = first; index <= last; ++index) {
            const frequency = firstFrequency * Math.pow(2, index / tonalSystem);
            const tone = new Tone(context, frequency, compensation(frequency));
            this.#implementation.tones.set(index, tone);
            tone.connect(this.#implementation.compensationGainNode, 1); //SA??? SA!!! unused!
        } //loop tones
        this.#implementation.compensationGainNode.connect(this.#implementation.masterGain); //SA??? SA!!! unused!
        const oscillatorTypeFourier = DefinitionSet.OscillatorType.getValue(0).name; //default
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
        this.#implementation.setFilterChain(DefinitionSet.defaultFilterSet);
    } //constructor

    play(on, index) { this.#implementation.tones.get(index).play(on); }

    playWith(usage, enable) {
        switch (usage) {
            case DefinitionSet.PlayControl.usage.frequencyModulation:
                for (let [_, tone] of this.#implementation.tones)
                    tone.frequencyModulationEnable = enable;
                return;
            case DefinitionSet.PlayControl.usage.amplitudeModulation:
                for (let [_, tone] of this.#implementation.tones)
                    tone.amplitudeModulationEnable = enable;
                return;
            case DefinitionSet.PlayControl.usage.gainEnvelope:
                for (let [_, tone] of this.#implementation.tones)
                    tone.gainEnvelopeEnable = enable;
                return;
            case DefinitionSet.PlayControl.usage.detuneEnvelope:
                for (let [_, tone] of this.#implementation.tones)
                    tone.detuneEnvelopeEnable = enable;
                return;
            case DefinitionSet.PlayControl.usage.frequencyModulationEnvelope:
                for (let [_, tone] of this.#implementation.tones)
                    tone.frequencyModulationEnvelopeEnable = enable;
                return;
            case DefinitionSet.PlayControl.usage.amplitudeModulationEnvelope:
                for (let [_, tone] of this.#implementation.tones)
                    tone.amplitudeModulationEnvelopeEnable = enable;
                return;
            case DefinitionSet.PlayControl.usage.filters: return this.#implementation.setFilterUsage(enable);
            default: return;
        } //switch
    } //playWith

    set data(dataset) {
        if (dataset.gainCompensation && dataset.gainCompensation.middleFrequency) {
            this.#implementation.gainCompensation = dataset.gainCompensation;
            this.#implementation.compensateToneGains();
        } //if dataset.gainCompensation
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

} //class Instrument
