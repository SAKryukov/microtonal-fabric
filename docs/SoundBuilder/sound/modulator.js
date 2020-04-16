class Modulator {

    #implementation = { isEnabled: true };

    constructor(audioContext) {
        this.#implementation.oscillator = new OscillatorNode(audioContext);
        this.#implementation.depthNode = new GainNode(audioContext);
        this.#implementation.depthNode.gain.value = 100; //SA???
        this.#implementation.onOffNode = new GainNode(audioContext);
        this.#implementation.output = this.#implementation.oscillator
            .connect(this.#implementation.depthNode).connect(this.#implementation.onOffNode);
    } //constuctor

    set enable(boolValue) { this.#implementation.onOffNode.value = boolValue ? 1 : 0;  }
    get enable() { return  this.#implementation.onOffNode.value == 1; }

    get frequency() { return this.#implementation.oscillator.frequency.value; }
    set frequency(value) { this.#implementation.oscillator.frequency.value = value; }

    get depth() { return this.#implementation.depthNode.gain.value; }
    set frequency(value) { this.#implementation.depthNode.gain.value = value; }

    connect(audioParameter) { this.#implementation.output.connect(audioParameter); return this; }
    disconnect() { this.#implementation.output.disconnect(); return this; }

} //class Modulator