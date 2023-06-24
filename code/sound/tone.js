// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

class Tone extends ModulatorSet {

    #implementation = { isFmEnvelopeEnabled: true, isAmEnvelopeEnabled: true, initialFrequency: null };

    constructor(audioContext, frequency, frequencyCompensationGain) {
        super(audioContext, frequency);
        const context = audioContext;
        this.#implementation.context = context;
        this.#implementation.initialFrequency = frequency;
        this.#implementation.mainOscillator = new OscillatorNode(context, { frequency: frequency });
        this.#implementation.frequencyCompensationGainNode = new GainNode(context, { gain: frequencyCompensationGain });
        this.#implementation.gainEnvelopeNode = new GainNode(context, { gain: 0 });
        this.#implementation.amplitudeModulationNode = new GainNode(context, { gain: 1 });
        this.#implementation.dynamicGainNode = new GainNode(context, { gain: 1 });
        this.#implementation.frequencyModulationEnvelopeNode = new GainNode(context, { gain: 0 });
        this.#implementation.amplitudeModulationEnvelopeNode = new GainNode(context, { gain: 0 });
        this.#implementation.frequencyModulationEnvelopeNode.connect(this.#implementation.mainOscillator.frequency);
        this.#implementation.amplitudeModulationEnvelopeNode.connect(this.#implementation.amplitudeModulationNode.gain);
        this.#implementation.gainEnvelope = new Envelope();
        this.#implementation.detuneEnvelope = new Envelope();
        this.#implementation.frequencyModulationEnvelope = new Envelope();
        this.#implementation.amplitudeModulationEnvelope = new Envelope();
        this.#implementation.mainOscillator.connect(this.#implementation.frequencyCompensationGainNode);
        this.#implementation.frequencyCompensationGainNode.connect(this.#implementation.dynamicGainNode);
        this.#implementation.dynamicGainNode.connect(this.#implementation.amplitudeModulationNode);
        this.#implementation.amplitudeModulationNode.connect(this.#implementation.gainEnvelopeNode);
        this.#implementation.mainOscillator.start();
        this.#implementation.deactivate = () => {
            super.baseDeactivate();
            this.#implementation.mainOscillator.stop();
            this.#implementation.mainOscillator.disconnect();
            this.#implementation.frequencyCompensationGainNode.disconnect();
            this.#implementation.dynamicGainNode.disconnect();
            this.#implementation.gainEnvelopeNode.disconnect();
            this.#implementation.amplitudeModulationNode.disconnect();
            this.#implementation.frequencyModulationEnvelopeNode.disconnect();
            this.#implementation.amplitudeModulationEnvelopeNode.disconnect();
        }; //this.#implementation.deactivate
    } //constructor

    play(on, frequency, dynamicGain) {
        if (on) {
            this.#implementation.mainOscillator.frequency.value = frequency == null ?
                this.#implementation.initialFrequency : frequency;
            this.#implementation.dynamicGainNode.gain.value = dynamicGain == null ? 1 : dynamicGain;
        } //if     
        this.#implementation.gainEnvelope.play(this.#implementation.context, this.#implementation.gainEnvelopeNode.gain, on);
        this.#implementation.detuneEnvelope.play(this.#implementation.context, this.#implementation.mainOscillator.detune, on);
        this.#implementation.frequencyModulationEnvelope.play(this.#implementation.context, this.#implementation.frequencyModulationEnvelopeNode.gain, on);
        this.#implementation.amplitudeModulationEnvelope.play(this.#implementation.context, this.#implementation.amplitudeModulationEnvelopeNode.gain, on);
    } //play
    
    pitchShift(frequency) { this.#implementation.mainOscillator.frequency.value = frequency; }

    set waveform(wave) {
        if (wave.constructor == String)
            this.#implementation.mainOscillator.type = wave;
        else
            this.#implementation.mainOscillator.setPeriodicWave(wave);
    } //set Waveform

    set gainEnvelope(data) { this.#implementation.gainEnvelope.data = data; }
    set detuneEnvelope(data) { this.#implementation.detuneEnvelope.data = data; }

    set data(dataset) {
        this.frequencyModulationData = dataset.frequencyModulation.relativeFrequency;
        this.amplitudeModulationData = dataset.amplitudeModulation.relativeFrequency;
        this.#implementation.frequencyModulationEnvelope.data = dataset.frequencyModulation.envelope;
        this.#implementation.amplitudeModulationEnvelope.data = dataset.amplitudeModulation.envelope;
    } //set data

    connect(audioNode) { return this.#implementation.gainEnvelopeNode.connect(audioNode); } 

    set gainEnvelopeEnable(enable) { this.#implementation.gainEnvelope.enable = enable; }    
    get gainEnvelopeEnable() { return this.#implementation.gainEnvelope.enable; }    
    set detuneEnvelopeEnable(enable) { this.#implementation.detuneEnvelope.enable = enable; }
    get detuneEnvelopeEnable() { return this.#implementation.detuneEnvelope.enable; }    
    set frequencyModulationEnvelopeEnable(enable) {
        this.#implementation.frequencyModulationEnvelope.enable = enable;
        this.#implementation.isFmEnvelopeEnabled = enable;
    } //set frequencyModulationEnvelopeEnable
    get frequencyModulationEnvelopeEnable() { return this.#implementation.isFmEnvelopeEnabled; }
    set amplitudeModulationEnvelopeEnable(enable) {
        this.#implementation.amplitudeModulationEnvelope.enable = enable;
        this.#implementation.isAmEnvelopeEnabled = enable;
    }  //set amplitudeModulationEnvelopeEnable
    get amplitudeModulationEnvelopeEnable() { return this.#implementation.isAmEnvelopeEnabled; }

    get frequencyModulatorTarget() { return this.#implementation.frequencyModulationEnvelopeNode; }
    get amplitudeModulatorTarget() { return this.#implementation.amplitudeModulationEnvelopeNode; }

    set sustain(value) { this.#implementation.gainEnvelope.sustain = value; }

    get frequency() { return this.#implementation.mainOscillator.frequency.value; } 

    transpose(frequency, frequencyCompensationGain) {
        this.#implementation.mainOscillator.frequency.value = frequency;
        this.#implementation.frequencyCompensationGainNode.gain.value = frequencyCompensationGain;
    } //transpose

    set gainCompensation(value) { this.#implementation.frequencyCompensationGainNode.gain.value = value; }

    deactivate() { this.#implementation.deactivate(); }

} //class Tone
