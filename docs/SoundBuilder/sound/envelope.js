class Envelope {

    #implementation = { sustain: DefinitionSet.PlayControl.minimalSustain, dampingSustain: DefinitionSet.PlayControl.minimalSustain  };
    
    constructor() {
        this.#implementation.usage = true; //SA???
        // to speed-up calculations:
        this.#implementation.typeExponential = DefinitionSet.EnvelopeElementIndex.exponential;
        this.#implementation.typeLinear = DefinitionSet.EnvelopeElementIndex.linear;
        this.#implementation.typeHeaviside = DefinitionSet.EnvelopeElementIndex.Heaviside;
    } //constructor

    connect() {}
    disconnect() {}
    play(gainNode, oscillatorNode, on) {
        let currentTime = gainNode.context.currentTime;
        gainNode.gain.cancelScheduledValues(0);
        // oscillatorNode.detune.cancelScheduledValues(0);
        // if (oscillatorNode && on) {
        //     oscillatorNode.detune.setTargetAtTime(4, currentTime + 0.2, 0.2);
        //     oscillatorNode.detune.setTargetAtTime(0, currentTime + 0.4, 0.2);
        //     oscillatorNode.detune.setTargetAtTime(-4, currentTime + 0.42, 0.2);
        //     oscillatorNode.detune.setTargetAtTime(0, currentTime + 1.4, 0.2);
        // } //if
        if ((!on) || (!this.#implementation.usage) || (!this.#implementation.data) || (this.#implementation.data.length < 2)) {
            const sustain = Math.max(this.#implementation.sustain, this.#implementation.dampingSustain);
            const gain =  on ? 1 : 0; 
            const timeConstant = on ? DefinitionSet.PlayControl.minimalAttack : sustain;
            gainNode.gain.setTargetAtTime(gain, currentTime, timeConstant);
            return;
        } //if
        if (on)
            console.log("on");
        for (let element of this.#implementation.data) {
            switch (element.type) {
                case this.#implementation.typeHeaviside:
                    gainNode.gain.setValueAtTime(element.gain, currentTime + element.time);
                    break;
                case this.#implementation.typeExponential:
                    if (element.gain == 0 || element.isLast)
                        gainNode.gain.setTargetAtTime(element.gain, currentTime,  element.time);
                    else
                        gainNode.gain.exponentialRampToValueAtTime(element.gain, currentTime + element.time);
                    break;
                case this.#implementation.typeLinear:
                    gainNode.gain.linearRampToValueAtTime(element.gain, currentTime + element.time);
                    break;
            } //switch
            currentTime += element.time;
        } //loop
    } //play

    set data(envelopeData) {
        this.#implementation.data = [];
        if (!envelopeData || envelopeData.length < 1) return;
        for (let dataElement of envelopeData.stages)
            this.#implementation.data.push({type: dataElement.functionIndex, time: dataElement.duration, gain: dataElement.gain,  })
        if (this.#implementation.data.length > 1)
            this.#implementation.data[this.#implementation.data.length - 1].isLast = true;
            this.#implementation.dampingSustain = envelopeData.dampingSustain;
        } //set data

    set usage(boolValue) { this.#implementation.usage = boolValue; }
    get usage() { return this.#implementation.usage; }
    
    set sustain(value) {
        if (value < DefinitionSet.PlayControl.minimalSustain) value = DefinitionSet.PlayControl.minimalSustain;
        this.#implementation.sustain = value;
    } //set sustain
    get sustain()  { return this.#implementation.sustain; }

} //class Envelope
