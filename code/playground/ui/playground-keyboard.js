// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

class PlaygroungKeyboard extends GridKeyboard {

    constructor(element, keyWidth, keyHeight, rowCount, rowWidth, keyColors) {
        super(element, keyWidth, keyHeight, rowCount, rowWidth, keyColors);
    }

    customKeyHandler(keyElement, keyData, on) {
        if (globalKeyTracker.isControlDown()) return false; // return false to stop embedded handling
        return super.customKeyHandler(keyElement, keyData, on); 
    } //customKeyHandler

    resetAllModes() { } //SA??? 

} //class PlaygroungKeyboard

