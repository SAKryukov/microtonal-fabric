class Tone extends ModulatorSet {

    #implementation = {};

    constructor(someNode, frequency) {
        const context = someNode.context;
        this.#implementation.mainOscilator = new OscillatorNode(context, { frequency: frequency });
        this.#implementation.envelopeNode = new GainNode(context, { gain: 0 });
        this.#implementation.gainEnvelope = new Envelope();
    } //constructor

    play(on) {
        if (!this.implementation.started) {
            this.mainOscillator.start();
            this.implementation.started = true;
        } //if
        this.#implementation.gainEnvelope.play(this.#implementation.envelopeNode, this.#implementation.mainOscilator, on);
    } //Play


    set waveform(wave) {
        if (wave.constructor == String)
            this.mainOscillator.type = wave;
        else
            this.#implementation.mainOscilator.setPeriodicWave(wave);
    } //set Waveform

    set data(dataset) {
        this.frequencyModulationData = dataset.frequencyModulation.relativeFrequency;
        this.amplitudeModulationData = dataset.amplitudeModulation.relativeFrequency;
    } //set data

} //class Tone
