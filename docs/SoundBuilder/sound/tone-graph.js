class ToneGraph {
    
    constructor(audioContext, frequency) {
        this.Initialize(audioContext, frequency);
    } //constructor

    Initialize(audioContext, frequency) {
        const randomizePhase = (audioCtx, oscillator) => {
            const real = new Float32Array(2);
            const imag = new Float32Array(2);
            const getRandom = (min, max) => Math.random() * (max - min) + min;
            const phase = getRandom(0, Math.PI * 2);
            real[0] = 0;
            imag[0] = 0;
            real[1] = Math.cos(phase);
            imag[1] = Math.sin(phase);
            oscillator.setPeriodicWave(audioCtx.createPeriodicWave(real, imag));
        }; //createPeriodicWave
        this.implementation = {};
        this.audioContext = audioContext; //new AudioContext();
        this.mainOscillator = this.audioContext.createOscillator();
        this.mainOscillator.frequency.value = frequency;
        this.mainOscillator.type = "triangle"; //"sine", "square", "sawtooth", "triangle" 
        this.frequencyModulationMasterGain = this.audioContext.createGain();
        this.amplitudeModulationMasterGain = this.audioContext.createGain();
        this.frequencyModulationEnvelope = this.audioContext.createGain();
        this.amplitudeModulationEnvelope = this.audioContext.createGain();
        this.envelope = this.audioContext.createGain();
        this.envelope.gain.value = 0;
        this.sustain = DefinitionSet.PlayControl.minimalSustain;
        this.frequencyModulationEnvelope.connect(this.frequencyModulationMasterGain);
        this.amplitudeModulationEnvelope.connect(this.amplitudeModulationMasterGain);
        this.frequencyModulationMasterGain.connect(this.mainOscillator.frequency);
        this.amplitudeModulationMasterGain.connect(this.mainOscillator.frequency);    
        this.mainOscillator.connect(this.envelope);
        this.output = this.envelope;    
        //SA???
        const frequencyModulationOscillator = this.audioContext.createOscillator();
        randomizePhase(this.audioContext, frequencyModulationOscillator);
        frequencyModulationOscillator.frequency.value = 15;
        frequencyModulationOscillator.connect(this.frequencyModulationEnvelope);
        this.frequencyModulationEnvelope.gain.value = 2;
        this.frequencyModulationMasterGain.gain.value = 1;
        //frequencyModulationOscillator.start(); //SA??? remove to remove modulation
        this.implementation.gainEnvelope = new Envelope();
    } //Initialize

    get Sustain() { return this.implementation.gainEnvelope.sustain; }
    set Sustain(ms) { this.implementation.gainEnvelope.sustain = ms; }

    Play(on) {
        if (!this.implementation.started) {
            this.mainOscillator.start();
            this.implementation.started = true;
        }
        this.implementation.gainEnvelope.play(this.envelope, this.mainOscillator, on);
    } //Play

    set Waveform(wave) {
        if (wave.constructor == String)
            this.mainOscillator.type = wave;
        else
            this.mainOscillator.setPeriodicWave(wave);
    } //set Waveform

    connect(node) { this.output.connect(node); return this; }
    disconnect() { this.output.disconnect(); return this; }

    set gainEnvelope(data) {
        this.implementation.gainEnvelope.data = data;
    }

} //class ToneGraph

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ToneNode {

    #implementation = {};
    
    constructor(audioContext, frequency) {
        this.#implementation = {};
        this.#implementation.oscillator = new OscillatorNode(audioContext);
        const amplitudeModulationTarget = new GainNode(audioContext);
        this.#implementation.gainEnvelopeTarget = new GainNode(audioContext);
        this.#implementation.FrequencyModulator = new Modulator();
        this.#implementation.AmplitudeModulator = new Modulator();
        this.#implementation.FrequencyModulator.connect(oscillator.frequency);
        this.#implementation.AmplitudeModulator.connect(amplitudeModulationTarget.gain);
        this.#implementation.gainEnvelope = new Envelope();
        this.#implementation.output = oscillator.connect(amplitudeModulationTarget).connect(this.#implementation.gainEnvelopeTarget);
        this.#implementation.oscillator.start();
    } //constructor

    play(on) {
        if (!this.implementation.started) {
            this.mainOscillator.start();
            this.implementation.started = true;
        }
        this.implementation.gainEnvelope.play(this.#implementation.gainEnvelopeTarget, on);
    } //play

    set waveform(wave) {
        if (wave.constructor == String)
            this.mainOscillator.type = wave;
        else
            this.mainOscillator.setPeriodicWave(wave);
    } //set waveform
   
} //class ToneNode
