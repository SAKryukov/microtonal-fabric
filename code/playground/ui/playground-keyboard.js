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
            return false;
            //SA???
            this.#playgroundImplementation.instrument.changeFrequencies(startingIndex, startingIndex + rowWidth - 1,
                index => 40);
            this.labelRow(row, index => `${index}`);
            return false;
        } //this.#playgroundImplementation.changeMode
    } //constructor

    customKeyHandler(keyElement, keyData, on) {
        // return false to stop embedded handling
        if (globalKeyTracker.isControlDown()) return this.#playgroundImplementation.changeMode(keyData);
        return super.customKeyHandler(keyElement, keyData, on); 
    } //customKeyHandler

    get instrument() { return this.#playgroundImplementation.instrument; }
    set instrument(instance) { this.#playgroundImplementation.instrument = instance; }

    resetAllModes() { } //SA??? 

} //class PlaygroungKeyboard

