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
            const metrics = this.derivedClassConstructorArguments[0];
            const row = keyData.customKeyData.y;
            const column = keyData.customKeyData.x;
            this.#playgroundImplementation.populationData.cycleMode(row, column);
            this.labelRow(row, x => this.#playgroundImplementation.populationData.labelHandler(x, row));
            this.setRowTitles(row, x => this.#playgroundImplementation.populationData.titleHandler(x, row));
            const startRowIndex = row * metrics.rowWidth;
            this.#playgroundImplementation.instrument.changeFrequencies(
                startRowIndex, startRowIndex + metrics.rowWidth - 1,
                this.#playgroundImplementation.populationData.createRowFrequencySet(row));
        }; //this.#playgroundImplementation.changeMode
        this.#playgroundImplementation.resetAllModes = () => {
            this.#playgroundImplementation.populationData.resetAllModes();
            const metrics = this.derivedClassConstructorArguments[0];
            for (let row = 0; row < metrics.rowCount; ++row) {
                this.labelRow(row, x => this.#playgroundImplementation.populationData.labelHandler(x, row));
                this.setRowTitles(row, x => this.#playgroundImplementation.populationData.titleHandler(x, row));
                const startRowIndex = row * metrics.rowWidth;
                this.#playgroundImplementation.instrument.changeFrequencies(
                    startRowIndex, startRowIndex + metrics.rowWidth - 1,
                    this.#playgroundImplementation.populationData.createRowFrequencySet(row));
            } //loop
        }; //.#playgroundImplementation.resetAllModes
    } //constructor

    customKeyHandler(keyElement, keyData, on) { //IKeyboardGeometry.customKeyHandler:
        // return false to stop embedded handling
        const changeMode = globalKeyTracker.isControlDown();
        if (changeMode && on)
            this.#playgroundImplementation.changeMode(keyData);
        if (changeMode) return false;
        return super.customKeyHandler(keyElement, keyData, on); 
    } //IKeyboardGeometry.customKeyHandler

    get instrument() { return this.#playgroundImplementation.instrument; }
    set instrument(instance) { this.#playgroundImplementation.instrument = instance; }
    get populationData() { return this.#playgroundImplementation.populationData; }
    set populationData(instance) { this.#playgroundImplementation.populationData = instance; }

    resetAllModes() { this.#playgroundImplementation.resetAllModes(); }

} //class PlaygroungKeyboard

