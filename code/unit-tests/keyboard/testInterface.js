// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

class IKeyboardGeometry extends IInterface {
    createKeys() {}
    highlightKey(element) {}
}

class Keyboard { // abstract, instantiation requires IKeyboardGeometry
    constructor() {
        IKeyboardGeometry.throwIfNotImplemented(this);
    }
}

class RoundKeyboard extends Keyboard {
    constructor() {
        super();
    }
    createKeys() {}
    highlightKey(element) {}
}

const keyboard = new RoundKeyboard();
