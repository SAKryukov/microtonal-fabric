// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

class ITest extends IInterface {
    methodBase() {}
    methodDerived() {}
    get propertyBase() {}
    get propertyDerived() {}
}

class AbstractBase {
    constructor() {
        ITest.throwIfNotImplemented(this);
    }
    static test() {
        ITest.throwIfNotImplemented(this);
    }
}

class Base extends AbstractBase {
    methodBase() {}
    get propertyBase() {}
}

class Derived extends Base {
    methodDerived() {}
    get propertyDerived() {}
    static test() {
        ITest.throwIfNotImplemented(this);
    }
}
Derived.test();

const getDescriptor = (obj, property) => {
    const constructor = obj.constructor;
    if (constructor == null) return null;
    const getConstructorDescriptor = (constructor, property) => {
        const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, property);
        if (descriptor == null) {
            const parentConstructor = Object.getPrototypeOf(constructor);
            if (parentConstructor == null) return null;
            return getConstructorDescriptor(parentConstructor, property);
        } else
            return descriptor;
    } //getConstructorDescriptor
    return getConstructorDescriptor(obj.constructor, property);
} //getDescriptor

const ddd = new Derived();
const s1 = getDescriptor(ddd, "methodDerived");
const s2 = getDescriptor(ddd, "methodBase");
const s3 = getDescriptor(ddd, "propertyDerived");
const s4 = getDescriptor(ddd, "propertyBase");

console.log("here");