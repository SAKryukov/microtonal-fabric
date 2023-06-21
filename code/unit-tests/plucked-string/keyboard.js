class StringKeyboard extends AbstractKeyboard {
    createKeys(parentElement) { return []; }
    createCustomKeyData(keyElement, index) {}
    highlightKey(keyElement, keyboardMode) {}
    isTouchKey(parentElement, keyElement) { return false; } // for touch interface
    get defaultChord() {} // should return array of indices of keys in default chord
    customKeyHandler(keyElement, keyData, on) {} // return false to stop embedded handling
} //class StringKeyboard
