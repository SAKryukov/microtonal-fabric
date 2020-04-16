class Instrument extends ModulatorSet {

    #implementation = { playControlUsage: 0xFF };

    constructor(first, last, firstFrequency, tonalSystem) {
        super();
        this.#implementation.tones = new Map();
        const context = new AudioContext();
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
        // SA???
        this.#implementation.filter = context.createBiquadFilter();
        this.#implementation.filter.type = "lowpass";
        //this.#implementation.filter.type = "allpass";
        this.#implementation.filter.Q.value = 0.01;
        this.#implementation.filter.frequency.value = 1000;
        // SA???
        this.#implementation.masterGain.connect(this.#implementation.filter).connect(context.destination);
        this.#implementation.setFilterUsage = enable => {
            this.#implementation.filter.disconnect();
            this.#implementation.masterGain.disconnect();
            if (enable)
                this.#implementation.masterGain.connect(this.#implementation.filter).connect(context.destination);                
            else
                this.#implementation.masterGain.connect(context.destination);
        } //this.#implementation.setFilterUsage
    } //constructor

    play(on, index) { this.#implementation.tones.get(index).play(on); }

    playWith(usage, enable) {
        if (usage != DefinitionSet.PlayControl.usage.filters) return; //SA???
        this.#implementation.setFilterUsage(enable);
    } //playWith

    set data(dataset) {
        this.#implementation.setWaveform(dataset.oscillator);
        for (let [_, tone] of this.#implementation.tones)
            tone.gainEnvelope = dataset.gainEnvelope;    
        super.frequencyModulationData = dataset.frequencyModulation.absoluteFrequency;
        super.amplitudeModulationData = dataset.amplitudeModulation.absoluteFrequency;
    } //set data

    get volume() { return this.#implementation.masterGain.gain.value; }
    set volume(value) { this.#implementation.masterGain.gain.value = value; }

    get sustain() { }
    set sustain(value) {  }

} //class Instrument
