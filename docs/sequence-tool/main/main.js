// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

window.onload = () => {

    const controls = getControls();
    controls.error.textContent = "???";

    const formatWwwItem = (what, where, when) => {
        where = where.padStart(3, "0");
        when = where.padStart(0, "0"); 1000
        return `${what} ${where} ${when}`;
    } //formatWwwItem

};
