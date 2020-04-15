class Synthesizer {
    
    #implementation = {};
    
    constructor(first, last, firstFrequency, tonalSystem) {
        this.#implementation = {};
        this.#implementation.tones = [];
        const audioContext = new AudioContext();
        this.#implementation.filter = audioContext.createBiquadFilter();
        this.#implementation.filter.type = "lowpass";
        //this.#implementation.filter.type = "allpass";
        this.#implementation.filter.Q.value = 0.01;
        this.#implementation.filter.frequency.value = 1000;
        this.#implementation.masterVolume = audioContext.createGain();
        this.#implementation.filter.connect(this.#implementation.masterVolume);
        this.#implementation.masterVolume.connect(audioContext.destination);
        for (let index = first; index <= last; ++index)
            this.#implementation.tones[index] = new ToneGraph(audioContext, firstFrequency * Math.pow(2, index / tonalSystem))
                .connect(this.#implementation.filter);
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
                wave = this.#implementation.masterVolume.context.createPeriodicWave(re, im);
            } else
                wave = oscillator.type;
            for (let tone of this.#implementation.tones)
                tone.Waveform = wave;    
        } //this.#implementation.setWaveform
    } //constructor

    set isFilterUsed(on) {
        const node = on ? this.#implementation.filter : this.#implementation.masterVolume;
        for (let tone of this.#implementation.tones)
            tone.disconnect().connect(node);
    } //set isFilterUsed

    // set IsFrequencyModulationUsed(on) {
    //     //SA???
    // } //set IsFrequencyModulationUsed

    play(on, index) { this.#implementation.tones[index].Play(on); }

    set sustain(value) {
        for (let tone of this.#implementation.tones)
            tone.Sustain = value;
    }  //set sustain

    set data(value) {
        this.#implementation.setWaveform(value.oscillator);
        for (let tone of this.#implementation.tones)
            tone.gainEnvelope = value.gainEnvelope;
    } //set data

    set volume(value) { this.#implementation.masterVolume.gain.value = value; }

} //class Synthesizer
