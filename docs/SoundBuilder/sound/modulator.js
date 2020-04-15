class Modulator {

    constructor(audioContext) {
        this.implementation = {};
        this.implementation.oscillator = new OscillatorNode(audioContext);
        this.implementation.envelopeNode = new GainNode(audioContext);
        this.implementation.envelopeNode.gain.value = 0;
        this.implementation.depthNode = new GainNode(audioContext);
        this.implementation.depthNode.gain.value = 100; //SA???
        this.implementation.onOffNode = new GainNode(audioContext);
        this.implementation.output = this.implementation.oscillator
            .connect(this.implementation.envelopeNode)
            .connect(this.implementation.depthNode).connect(this.implementation.onOffNode);
        this.implementation.envelope = new Envelope();
    } //constuctor

    play(on) { this.implementation.envelope.play(this.implementation.envelopeNode, on); } 

    set data(envelopeData) { this.implementation.envelope.data = envelopeData; }

    get frequency() { return this.implementation.oscillator.frequency.value; }
    set frequency(value) { this.implementation.oscillator.frequency.value = value; }

    get depth() { return this.implementation.depthNode.gain.value; }
    set frequency(value) { this.implementation.depthNode.gain.value = value; }

    connect(audioParameter) { this.implementation.output.connect(audioParameter); return this; }
    disconnect() { this.implementation.output.disconnect(); return this; }

} //class Modulator