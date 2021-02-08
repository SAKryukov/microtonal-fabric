// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

class ITestKeyboardGeometry extends IInterface {
    createKeys() {}
    highlightKey(element, p01, p02) {}
}

class Keyboard { // abstract, instantiation requires IKeyboardGeometry
    constructor() {
        //ITestKeyboardGeometry.throwIfNotImplemented(this);
    }
}

class RoundKeyboard extends Keyboard {
    constructor() {
        super();
    }
    createKeys() {}
    highlightKey(element) {}
    static Test() {
        ITestKeyboardGeometry.throwIfNotImplemented(this, IInterfaceStrictness.implementorShouldHandleSameNumberOfFunctionArgumentsOrLess);
    }
}
RoundKeyboard.Test();

const keyboard = new RoundKeyboard();
