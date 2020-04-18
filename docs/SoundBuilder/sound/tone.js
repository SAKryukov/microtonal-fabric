class Tone extends ModulatorSet {

    #implementation = { isFmEnabled: true, isAmEnabled: true };

    constructor(audioContext, frequency) {
        super(audioContext, frequency);
        const context = audioContext;
        this.#implementation.context = context;
        this.#implementation.mainOscillator = new OscillatorNode(context, { frequency: frequency });
        this.#implementation.gainEnvelopeNode = new GainNode(context, { gain: 0 });
        this.#implementation.detuneEnvelopeNode = new GainNode(context, { gain: 0 });
        this.#implementation.amplitudeModulationNode = new GainNode(context, { gain: 1 });
        this.#implementation.absoluteFrequencyModulationEnvelopeNode = new GainNode(context, { gain: 100 });
        this.#implementation.absoluteAmplitudeModulationEnvelopeNode = new GainNode(context, { gain: 100 });
        this.#implementation.relativeFrequencyModulationEnvelopeNode = new GainNode(context, { gain: 100 });
        this.#implementation.relativeAmplitudeModulationEnvelopeNode = new GainNode(context, { gain: 100 });
        this.#implementation.absoluteFrequencyModulationEnvelopeNode.connect(this.#implementation.mainOscillator.frequency);
        this.#implementation.relativeFrequencyModulationEnvelopeNode.connect(this.#implementation.mainOscillator.frequency);
        this.#implementation.absoluteAmplitudeModulationEnvelopeNode.connect(this.#implementation.amplitudeModulationNode.gain);
        this.#implementation.relativeAmplitudeModulationEnvelopeNode.connect(this.#implementation.amplitudeModulationNode.gain);
        this.#implementation.gainEnvelope = new Envelope();
        this.#implementation.detuneEnvelope = new Envelope();
        this.#implementation.absoluteFrequencyModulationEnvelope = new Envelope();
        this.#implementation.absoluteAmplitudeModulationEnvelope = new Envelope();
        this.#implementation.relativeFrequencyModulationEnvelope = new Envelope();
        this.#implementation.relativeAmplitudeModulationEnvelope = new Envelope();
        this.#implementation.mainOscillator.connect(this.#implementation.amplitudeModulationNode).connect(this.#implementation.gainEnvelopeNode);
        this.#implementation.mainOscillator.start();
    } //constructor

    play(on) {
        this.#implementation.gainEnvelope.play(this.#implementation.context, this.#implementation.gainEnvelopeNode.gain, on);
        this.#implementation.detuneEnvelope.play(this.#implementation.context, this.#implementation.mainOscillator.detune, on);
        /*
        this.#implementation.relativeFrequencyModulationEnvelope.play(this.#implementation.context, this.#implementation.relativeFrequencyModulationEnvelopeNode.gain, on);
        this.#implementation.absoluteFrequencyModulationEnvelope.play(this.#implementation.context, this.#implementation.absoluteFrequencyModulationEnvelopeNode.gain, on);
        this.#implementation.relativeAmplitudeModulationEnvelope.play(this.#implementation.context, this.#implementation.relativeFrequencyModulationEnvelopeNode.gain, on);
        this.#implementation.absoluteAmplitudeModulationEnvelope.play(this.#implementation.context, this.#implementation.absoluteFrequencyModulationEnvelopeNode.gain, on);
        */
    } //play

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
    } //set data

    connect(audioNode) { return this.#implementation.gainEnvelopeNode.connect(audioNode); } 

    set gainEnvelopeEnable(enable) { this.#implementation.gainEnvelope.enable = enable; }    
    get gainEnvelopeEnable() { return this.#implementation.gainEnvelope.enable; }    
    set detuneEnvelopeEnable(enable) { this.#implementation.detuneEnvelope.enable = enable; }    
    get detuneEnvelopeEnable() { return this.#implementation.detuneEnvelope.enable; }    
    set frequencyModulationEnvelopeEnable(enable) {
        this.#implementation.absoluteFrequencyModulationEnvelope.enable = enable;
        this.#implementation.relativeAmplitudeModulationEnvelope.enable = enable;
        this.#implementation.isFmEnabled = enable;
    } //set frequencyModulationEnvelopeEnable
    get frequencyModulationEnvelopeEnable() { return this.#implementation.isFmEnabled; }
    set amplitudeModulationEnvelopeEnable(enable) {
        this.#implementation.absoluteAmplitudeModulationEnvelope.enable = enable;
        this.#implementation.relativeAmplitudeModulationEnvelope.enable = enable;
        this.#implementation.isAmEnabled = enable;
    }  //set amplitudeModulationEnvelopeEnable
    get amplitudeModulationEnvelopeEnable() { return this.#implementation.isAmEnabled; }

    get absoluteFrequencyModulatorTarget() { return this.#implementation.mainOscillator.frequency; }
    get absoluteAmplitudeModulatorTarget() { return this.#implementation.amplitudeModulationNode.gain; }

} //class Tone
