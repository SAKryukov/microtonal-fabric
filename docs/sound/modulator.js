class Modulator {

    #implementation = { isEnabled: true };

    constructor(audioContext) {
        this.#implementation.oscillator = new OscillatorNode(audioContext);
        this.#implementation.depthNode = new GainNode(audioContext);
        this.#implementation.depthNode.gain.value = 100;
        this.#implementation.oscillator.connect(this.#implementation.depthNode);
        this.#implementation.oscillator.start();
        this.#implementation.output = this.#implementation.depthNode;
        this.#implementation.deactivate = _ => {
            this.#implementation.oscillator.stop();
            this.#implementation.oscillator.disconnect();
            this.#implementation.depthNode.disconnect();
        }; //this.#implementation.deactivate
    } //constuctor

    get frequency() { return this.#implementation.oscillator.frequency.value; }
    set frequency(value) { this.#implementation.oscillator.frequency.value = value; }

    get depth() { return this.#implementation.depthNode.gain.value; }
    set depth(value) { this.#implementation.depthNode.gain.value = value; }

    connect(audioParameter) {
        this.#implementation.output.connect(audioParameter);
        return this;
    } //connect
    disconnect() { this.#implementation.output.disconnect(); return this; }

    deactivate() { this.#implementation.deactivate(); }

} //class Modulator