class Instrument extends ModulatorSet {

    #implementation = { playControlUsage: 0xFF };

    constructor(first, last, firstFrequency, tonalSystem) {
        super();
        this.#implementation.tones = new Map();
        const context = new AudioContext();
        this.context = context;
        this.#implementation.masterGain = new GainNode(context, { gain: 1 });
        for (let index = first; index <= last; ++index) {
            const tone = new Tone(context, firstFrequency * Math.pow(2, index / tonalSystem));
            this.#implementation.tones.set(index, tone);
            tone.connect(this.#implementation.masterGain);
        } //loop tones
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
            case DefinitionSet.PlayControl.usage.frequencyModulation: return;
            case DefinitionSet.PlayControl.usage.amplitudeModulation: return;
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
        this.#implementation.setWaveform(dataset.oscillator);
        for (let [_, tone] of this.#implementation.tones) {
            tone.gainEnvelope = dataset.gainEnvelope;    
            tone.detuneEnvelope = dataset.detuneEnvelope;    
        }
        super.frequencyModulationData = dataset.frequencyModulation.absoluteFrequency;
        super.amplitudeModulationData = dataset.amplitudeModulation.absoluteFrequency;
        for (let [_, tone] of this.#implementation.tones) {
            tone.data = dataset;
            tone.frequencyModulationData = dataset.frequencyModulation.relativeFrequency;
            tone.amplitudeModulationData = dataset.amplitudeModulation.relativeFrequency;
            super.connectToAudioParameters(tone.absoluteFrequencyModulatorTarget, tone.absoluteAmplitudeModulatorTarget);
        }
        this.#implementation.setFilterChain(dataset.filter);
    } //set data

    get volume() { return this.#implementation.masterGain.gain.value; }
    set volume(value) { this.#implementation.masterGain.gain.value = value; }

    get sustain() { }
    set sustain(value) {  }

} //class Instrument
