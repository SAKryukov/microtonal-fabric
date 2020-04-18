class ModulatorSet {

    #implementation = {};

    constructor(audioContext, soundSourceFrequency) {
        if (audioContext)
            this.context = audioContext;
        this.#implementation.soundSourceFrequency == soundSourceFrequency; // undefined for absolute-frequency modulator
        this.#implementation.frequencyModulatorList = [];
        this.#implementation.amplitudeModulatorList = [];
        this.#implementation.frequencyModulatatioMasterDepth = 100;
        this.#implementation.amplitudeModulatatioMasterDepth = 100;
        this.#implementation.populate = (modulatorList, modulationData, ) => {
            for (let modulator of modulatorList)
                modulator.disconnect();
            modulatorList.splice(0);
            for (let dataElement of modulationData) {
                let frequency = dataElement.frequency;
                if (soundSourceFrequency)
                    frequency *= soundSourceFrequency;
                const modulator = new Modulator(this.context);  
                modulator.depth = dataElement.depth;
                modulator.frequency = dataElement.frequency;
                modulatorList.push(modulator);
            } //loop
        } //this.#implementation.populate
    } //constructor

    // interface:

    set frequencyModulationData(dataset) { this.#implementation.populate(this.#implementation.frequencyModulatorList, dataset); }
    set amplitudeModulationData(dataset) { this.#implementation.populate(this.#implementation.amplitudeModulatorList, dataset); }

    connectToAudioParameters(frequencyAudioParameter, amplitudeAudioParameter) {
        this.#implementation.frequencyAudioParameter = frequencyAudioParameter;
        this.#implementation.amplitudeAudioParameter = amplitudeAudioParameter;
        const connectTo = (list, audioParameter) => {
            for (let modulator of list)
                modulator.connect(audioParameter);
        } //connectTo
        if (frequencyAudioParameter)
            connectTo(this.#implementation.frequencyModulatorList, frequencyAudioParameter);
        if (amplitudeAudioParameter)
            connectTo(this.#implementation.amplitudeModulatorList, amplitudeAudioParameter);
    } //connectToAudioParameters

} //class ModulatorSet
