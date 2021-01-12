// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard

"use strict";

const setMetadata = () => {

    const elements = {
        metadata: {
            version: document.querySelector("footer > span:first-child"),
            years:  document.querySelector("footer > span:last-of-type"),
        },
    }; //elements

    elements.metadata.version.textContent = sharedDefinitionSet.version;
    elements.metadata.years.textContent = sharedDefinitionSet.years;
    
} //setMetadata
