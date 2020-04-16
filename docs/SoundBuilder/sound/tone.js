class Tone extends ModulatorSet {

    #implementation = {};

    constructor(audioContext, frequency) {
        super(frequency);
        const context = audioContext;
        this.#implementation.mainOscilator = new OscillatorNode(context, { frequency: frequency });
        this.#implementation.gainEnvelopeNode = new GainNode(context, { gain: 0 });
        this.#implementation.absoluteFrequencyModulationEnvelopeNode = new GainNode(context, { gain: 0 });
        this.#implementation.absoluteAmplitudeModulationEnvelopeNode = new GainNode(context, { gain: 0 });
        this.#implementation.relativeFrequencyModulationEnvelopeNode = new GainNode(context, { gain: 0 });
        this.#implementation.relativeAmplitudeModulationEnvelopeNode = new GainNode(context, { gain: 0 });
        this.#implementation.gainEnvelope = new Envelope();
        this.#implementation.absoluteFrequencyModulationEnvelope = new Envelope();
        this.#implementation.absoluteAmplitudeModulationEnvelope = new Envelope();
        this.#implementation.relativeFrequencyModulationEnvelope = new Envelope();
        this.#implementation.relativeAmplitudeModulationEnvelope = new Envelope();
        this.#implementation.mainOscilator.connect(this.#implementation.gainEnvelopeNode);
    } //constructor

    play(on) {
        if (!this.#implementation.started) {
            this.#implementation.mainOscilator.start();
            this.#implementation.started = true;
        } //if
        this.#implementation.gainEnvelope.play(this.#implementation.gainEnvelopeNode, on);
        this.#implementation.relativeFrequencyModulationEnvelope.play(this.#implementation.relativeFrequencyModulationEnvelopeNode, on);
        this.#implementation.absoluteFrequencyModulationEnvelope.play(this.#implementation.absoluteFrequencyModulationEnvelopeNode, on);
        this.#implementation.relativeAmplitudeModulationEnvelope.play(this.#implementation.relativeFrequencyModulationEnvelopeNode, on);
        this.#implementation.absoluteAmplitudeModulationEnvelope.play(this.#implementation.absoluteFrequencyModulationEnvelopeNode, on);
    } //play

    set waveform(wave) {
        if (wave.constructor == String)
            this.mainOscillator.type = wave;
        else
            this.#implementation.mainOscilator.setPeriodicWave(wave);
    } //set Waveform

    set gainEnvelope(data) { this.#implementation.gainEnvelope.data = data; }

    set data(dataset) {
        this.frequencyModulationData = dataset.frequencyModulation.relativeFrequency;
        this.amplitudeModulationData = dataset.amplitudeModulation.relativeFrequency;
    } //set data

    connect(audioNode) { return this.#implementation.gainEnvelopeNode.connect(audioNode); } 

} //class Tone
