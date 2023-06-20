// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

class Enumeration {

    #implementation = {};

    constructor(values) { // values: list of strings or objects { name: name, humanReadableName: name; value: value }
        this.#implementation.indexMap = new Map();
        this.#implementation.nameMap = new Map();
        let index = 0;
        let fullMember;
        for (let member of values) {
            if (member == null) continue;
            if (member.constructor == String) {
                fullMember = { index: index, name: member, humanReadableName: member };
                this[member] = member;
            } else {
                fullMember = { index: index, name: member.name, humanReadableName: member.humanReadableName };
                if (member.value != undefined)
                    fullMember.value = member.value;
                this[member.name] = member.name;
            } //if
            this.#implementation.indexMap.set(index, fullMember);    
            this.#implementation.nameMap.set(fullMember.name, index);
            ++index;
        } //loop
    } //constructor

    getValue(index) { return this.#implementation.indexMap.get(index); }
    getIndex(name) { return this.#implementation.nameMap.get(name); }
    
    forEach(method) {
        if (!method) return;
        for (let [_, value] of this.#implementation.indexMap)
            method(value); 
    } //forEach

    static namedEnumeration(baseObject) {
        for (let index in baseObject)
        if (baseObject[index].constructor != String)
            baseObject[index] = index;
        return Object.freeze(baseObject);    
    } //namedEnumeration
 
} //class Enumeration
