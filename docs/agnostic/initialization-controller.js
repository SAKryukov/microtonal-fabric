// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

const initializationController = {
    badJavaScriptEngine: () => {
        if (!goodJavaScriptEngine) {
            const title = `This application requires JavaScript engine better conforming to the standard`;
            const advice =
                `Browsers based on V8 engine are recommended, such as ` +
                `Chromium, Chrome, Opera, Vivaldi, Microsoft Edge v.&thinsp;80.0.361.111 or later, and more`;
            document.body.style.padding = "1em";
            document.body.innerHTML = `<h1>${title}.<br/><br/>${advice}&hellip;</h1><br/>`; // last <br/> facilitates selection (enabled)
            return true;
        } //goodJavaScriptEngine                    
    }, //badJavaScriptEngine
    initialize: function (hiddenControls, startControl, startControlParent, startHandler) {
        for (let control of hiddenControls) {
            const style = window.getComputedStyle(control);
            const display = style.getPropertyValue("display");
            this.hiddenControlMap.set(control, display);
            control.style.display = "none";
        } //loop
        startControl.focus();
        const restore = () => {
            startControlParent.style.display = "none";
            for (let control of hiddenControls) {
                control.style.visibility = "visible";
                control.style.display = this.hiddenControlMap.get(control);
            } //loop
        }; //restore
        startControl.onclick = event => {
            document.body.style.cursor = "wait";
            startHandler();
            restore();
            document.body.style.cursor = "auto";
        } //startControl.onclick
    }, //initialize
    hiddenControlMap: new Map()
}; //initializationController
