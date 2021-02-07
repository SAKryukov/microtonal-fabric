// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

class IInterface {

    static isImplementedBy(testObject) {
        const thisAsPrototype = Reflect.getPrototypeOf(new this());
        const list = Reflect.ownKeys(thisAsPrototype);
        for (let property of list) {
            if (thisAsPrototype[property].constructor != Function) continue;
            const test = testObject[property];
            if (!test || test.constructor != Function) return false;
        }
        return true;
    } //isImplementedBy

    static throwNotImplemented(implementor) {
        throw new Error(`${implementor.constructor.name} should implement ${this.name}`);
    } //throwNotImplemented

    static throwIfNotImplemented(implementor) {
        if (!this.isImplementedBy(implementor))
            this.throwNotImplemented(implementor);
    } //throwNotImplemented

} //class IInterface
