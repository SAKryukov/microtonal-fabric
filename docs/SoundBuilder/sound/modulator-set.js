class ModulatorSet {

    #implementation = {};

    constructor(soundSourceFrequency) {
        this.#implementation.soundSourceFrequency == soundSourceFrequency; // undefined for absolute-frequency modulator
        this.#implementation.frequencyModulatorList = [];
        this.#implementation.amplitudeModulatorList = [];
        this.#implementation.frequencyModulatatioMasterDepth = 100;
        this.#implementation.amplitudeModulatatioMasterDepth = 100;
        this.#implementation.populate = (modulatorList, modulationData, ) => {
            for (let modulator of modulatorList)
                modulator.disconnect();
            for (let dataElement of modulationData) {
                const modulator = new Modulator();
                if (soundSourceFrequency)
                    modulator.frequency = dataElement.frequency * soundSourceFrequency;
                else
                    modulator.frequency = dataElement.frequency;
                modulator.depth = dataElement.depth;
                modulatorList.push(modulator);
            } //loop
        } //this.#implementation.populate
    } //constructor

    // interface:

    set frequencyModulationData(dataset) { this.#implementation.populate(this.#implementation.frequencyModulatorList, dataset); }
    set amplitudeModulationData(dataset) { this.#implementation.populate(this.#implementation.amplitudeModulatorList, dataset); }

    connect(frequencyAudioParameter, amplitudeAudioParameter) {
        connectTo = (list, audioParameter) => {
            for (let modulator of list)
                modulator.connect(audioParameter);
        } //connectTo
        connectTo(this.#implementation.frequencyModulatorList, frequencyAudioParameter);
        connectTo(this.#implementation.amplitudeModulatorList, amplitudeAudioParameter);
    } //connect

} //class ModulatorSet
