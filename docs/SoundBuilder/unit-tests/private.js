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
