// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

class PlaygroungKeyboard extends GridKeyboard {

    #playgroundImplementation = { instrument: null, };

    constructor(element, keyWidth, keyHeight, rowCount, rowWidth, keyColors) {
        super(element, keyWidth, keyHeight, rowCount, rowWidth, keyColors);
        this.#playgroundImplementation.changeMode = keyData => {
            const startingIndex = keyData.index - keyData.customKeyData.x;
            const row = keyData.customKeyData.y;
            const column = keyData.customKeyData.x;
            this.#playgroundImplementation.populationData.cycleMode(row, column);
            this.labelRow(row, x => this.#playgroundImplementation.populationData.labelHandler(x, row));
            return false;
            //SA???
            this.#playgroundImplementation.instrument.changeFrequencies(startingIndex, startingIndex + rowWidth - 1,
                index => 40);
            return false;
        } //this.#playgroundImplementation.changeMode
    } //constructor

    customKeyHandler(keyElement, keyData, on) { //IKeyboardGeometry.customKeyHandler:
        // return false to stop embedded handling
        if (globalKeyTracker.isControlDown()) return this.#playgroundImplementation.changeMode(keyData);
        return super.customKeyHandler(keyElement, keyData, on); 
    } //IKeyboardGeometry.customKeyHandler

    get instrument() { return this.#playgroundImplementation.instrument; }
    set instrument(instance) { this.#playgroundImplementation.instrument = instance; }
    get populationData() { return this.#playgroundImplementation.populationData; }
    set populationData(instance) { this.#playgroundImplementation.populationData = instance; }

    resetAllModes() { } //SA??? 

} //class PlaygroungKeyboard

