class Envelope {

    #implementation = {
        sustain: DefinitionSet.PlayControl.minimalSustain,
        dampingSustain: DefinitionSet.PlayControl.minimalSustain,
        isEnabled: true,
    };
    
    constructor() {
        // to speed-up calculations:
        this.#implementation.typeExponential = DefinitionSet.EnvelopeElementIndex.exponential;
        this.#implementation.typeLinear = DefinitionSet.EnvelopeElementIndex.linear;
        this.#implementation.typeHeaviside = DefinitionSet.EnvelopeElementIndex.Heaviside;
    } //constructor

    connect() {}
    disconnect() {}
    play(context, audioParameter, on) {
        let currentTime = context.currentTime;
        audioParameter.cancelScheduledValues(0);
        if ((!on) || (!this.#implementation.isEnabled) || (!this.#implementation.data) || (this.#implementation.data.length < 2)) {
            const sustain = this.#implementation.isEnabled ? 
                    Math.max(this.#implementation.sustain, this.#implementation.dampingSustain)
                    :
                    DefinitionSet.PlayControl.minimalSustain;
            const gain =  on ? 1 : 0; 
            const timeConstant = on ? DefinitionSet.PlayControl.minimalAttack : sustain;
            audioParameter.setTargetAtTime(gain, currentTime, timeConstant);
            return;
        } //if
        for (let element of this.#implementation.data) {
            switch (element.type) {
                case this.#implementation.typeHeaviside:
                    audioParameter.setValueAtTime(element.gain, currentTime + element.time);
                    break;
                case this.#implementation.typeExponential:
                    if (element.gain == 0 || element.isLast)
                        audioParameter.setTargetAtTime(element.gain, currentTime,  element.time);
                    else
                        audioParameter.exponentialRampToValueAtTime(element.gain, currentTime + element.time);
                    break;
                case this.#implementation.typeLinear:
                    audioParameter.linearRampToValueAtTime(element.gain, currentTime + element.time);
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

    set enable(boolValue) { this.#implementation.isEnabled = boolValue; }
    get enable() { return this.#implementation.isEnabled; }
    
    set sustain(value) {
        if (value < DefinitionSet.PlayControl.minimalSustain) value = DefinitionSet.PlayControl.minimalSustain;
        this.#implementation.sustain = value;
    } //set sustain
    get sustain()  { return this.#implementation.sustain; }

} //class Envelope
