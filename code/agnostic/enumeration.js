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

    constructor(values) { // values: list of strings or objects { name: name, humanReadableName: name; }
        this.#implementation.indexMap = new Map();
        this.#implementation.nameMap = new Map();
        let index = 0;
        let fullMember;
        for (let member of values) {
            if (member.constructor == String)
                fullMember = { index: index, name: member, humanReadableName: member };
            else 
                fullMember = { index: index, name: member.name, humanReadableName: member.humanReadableName };
            this.#implementation.indexMap.set(index, fullMember);    
            this.#implementation.nameMap.set(fullMember.name, index);    
            ++index;
        } //loop
    } //constructor

    getValue(index) { return this.#implementation.indexMap.get(index); }
    getIndex(name) { return this.#implementation.nameMap.get(name); }
    
    forEach(method) {
        if (!method) return;
        for (let [key, value] of this.#implementation.indexMap)
            method(value); 
    } //forEach
 
} //class Enumeration