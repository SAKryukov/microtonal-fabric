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
        if (testObject == null || this.prototype == null) return false;
        const properties = Object.getOwnPropertyNames(this.prototype);
        const compareFunctions = (required, implemented) => {
            if (implemented && implemented.constructor != Function) return false;
            if (strictness == IInterfaceStrictness.anyNumberOfFunctionArguments) return true;
            const requiredArgumentCount = required.length;
            const implementedArgumentCount = implemented.length;
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
            return true;
        } //compareFunctions
        const compareGettersSetters = (required, implemented) => {
            if ((required.get == null && implemented.get != null) || (required.get != null && implemented.get == null)) return false;
            if ((required.set == null && implemented.set != null) || (required.set != null && implemented.set == null)) return false;
            return true; 
        } //compareGettersSetters
        for (let property of properties) {
            if (this.prototype[property] == this.prototype.constructor) continue;
            const descriptor = Object.getOwnPropertyDescriptor(this.prototype, property);
            if (descriptor.get != null || descriptor.get != null) {
                if (!compareGettersSetters(descriptor, Object.getOwnPropertyDescriptor(testObject.constructor.prototype, property))) return false;
            } else if (descriptor.value != null && descriptor.value.constructor == Function) {
                if (!compareFunctions(this.prototype[property], testObject[property])) return false;
            } //if
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
