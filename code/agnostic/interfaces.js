// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

const IInterfaceStrictness = {
    anyNumberOfFunctionArguments: 0,
    sameNumberOfFunctionArguments: 1,
    implementorShouldHandleSameNumberOfFunctionArgumentsOrMore: 2,
    implementorShouldHandleSameNumberOfFunctionArgumentsOrLess: 3,
    default: 0,
}; //IInterfaceStrictness

class IInterface {

    static isImplementedBy(testObject, strictness) {
        if (testObject == null) return false;
        if (strictness == null) strictness = IInterfaceStrictness.default;
        if (testObject.constructor == Function) testObject = new testObject();
        const thisAsPrototype = Reflect.getPrototypeOf(new this());
        const list = Reflect.ownKeys(thisAsPrototype);
        for (let property of list) {
            if (thisAsPrototype[property].constructor != Function) continue;
            const test = testObject[property];
            if (!test || test.constructor != Function) return false;
            if (strictness == IInterfaceStrictness.anyNumberOfFunctionArguments) continue;
            const requiredArgumentCount = thisAsPrototype[property].length;
            const implementedArgumentCount = test.length;
            switch(strictness) {
                case IInterfaceStrictness.sameNumberOfFunctionArguments:
                    if (requiredArgumentCount != implementedArgumentCount) return false;
                    break;
                case IInterfaceStrictness.implementorShouldHandleSameNumberOfFunctionArgumentsOrMore:
                    if (implementedArgumentCount < requiredArgumentCount) return false;
                    break;
                case IInterfaceStrictness.implementorShouldHandleSameNumberOfFunctionArgumenOrLess:
                        if (implementedArgumentCount > requiredArgumentCount) return false;
                } //switch
        } //loop
        return true;
    } //isImplementedBy

    static throwNotImplemented(implementor) {
        if (implementor == null)
            throw new Error(`${implementor} cannot implement ${this.name}`);
        const implementorName = implementor == Function
            ? implementor.name
            : implementor.constructor.name;
        throw new Error(`${implementorName} should implement ${this.name}`);
    } //throwNotImplemented

    static throwIfNotImplemented(implementor, strictness) {
        if (!this.isImplementedBy(implementor, strictness))
            this.throwNotImplemented(implementor);
    } //throwNotImplemented

} //class IInterface
