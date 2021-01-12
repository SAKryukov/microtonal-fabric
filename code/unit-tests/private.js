// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";


class Test {

    #implementation = {};
    constructor() {
        this.#implementation.value = "Default value";
    } //constructor

    set value(aValue) { this.#implementation.value = aValue; }
    get value() { return this.#implementation.value; }

} //class Test

function test() {
    const o = new Test();
    const first = o.value;
    o.value = "new value";
    const second = o.value;
    return `Before: "${first}", after: "${second}"`;
}
document.body.textContent = test();
