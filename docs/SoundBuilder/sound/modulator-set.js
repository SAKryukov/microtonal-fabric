class ModulatorSet {

    #implementation = {};

    constructor(audioContext, soundSourceFrequency) {
        if (audioContext)
            this.context = audioContext;
        this.#implementation.soundSourceFrequency == soundSourceFrequency; // undefined for absolute-frequency modulator
        this.#implementation.frequencyModulatorList = [];
        this.#implementation.amplitudeModulatorList = [];
        this.#implementation.populate = (modulatorList, masterDepthMode, modulationData) => {
            if (masterDepthMode)
                masterDepthMode.gain.value = modulationData.masterDepth;
            for (let modulator of modulatorList)
                modulator.disconnect();
            modulatorList.splice(0);
            for (let dataElement of modulationData.modes) {
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

    set frequencyModulationData(dataset) {
        this.#implementation.populate(this.#implementation.frequencyModulatorList, this.#implementation.frequencyModulatatioMasterDepth, dataset);
    } //set frequencyModulationData
    set amplitudeModulationData(dataset) {
        this.#implementation.populate(this.#implementation.amplitudeModulatorList, this.#implementation.amplitudeModulatatioMasterDepth, dataset); 
    } //set amplitudeModulationData

    connectToAudioParameters(frequencyAudioParameter, amplitudeAudioParameter) {
        this.#implementation.frequencyAudioParameter = frequencyAudioParameter;
        this.#implementation.amplitudeAudioParameter = amplitudeAudioParameter;
        const connectTo = (list, masterDepthMode, audioParameter) => {
            for (let modulator of list)
                modulator.connect(masterDepthMode);
            masterDepthMode.connect(audioParameter);
        } //connectTo
        if (frequencyAudioParameter) {
            if (!this.#implementation.frequencyModulatatioMasterDepth)
                this.#implementation.frequencyModulatatioMasterDepth = new GainNode(this.context, { gain: 1 });
            connectTo(this.#implementation.frequencyModulatorList, this.#implementation.frequencyModulatatioMasterDepth, frequencyAudioParameter);    
        } //if
        if (amplitudeAudioParameter) {
            if (!this.#implementation.amplitudeModulatatioMasterDepth)
                this.#implementation.amplitudeModulatatioMasterDepth = new GainNode(this.context, { gain: 1 });
            connectTo(this.#implementation.amplitudeModulatorList, this.#implementation.amplitudeModulatatioMasterDepth, amplitudeAudioParameter);
        } //if
    } //connectToAudioParameters

} //class ModulatorSet
