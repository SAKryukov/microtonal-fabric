// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

const setReadonly = (target, recursive) => {
    const readonlyHandler = { set(obj, prop, value) { return false; } };
    if (recursive)
        for (let index in target) {
            const value = target[index];
            if (value == null || value == undefined) continue;
            const constructorObject = value.constructor;
            if (constructorObject == Array || constructorObject == Object)
                target[index] = setReadonly(value, recursive);
        } //loop
    return new Proxy(target, readonlyHandler);
}; //setReadonly

