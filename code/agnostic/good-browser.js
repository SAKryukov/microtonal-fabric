// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2023
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

function handleGoodBrowser(scripts, successAction, errorAction) {

    const globalError = {
        hasError: false,
        message: null,
        source: null,
        line: null,
        column: null,
        error: null
    };

    const incompatibleMessage = function(message, style, showDiagnostics) {
        while (document.body.lastChild) document.body.removeChild(document.body.lastChild);
        document.body.style.padding = "1em";
        const text = document.createElement("p");
        text.textContent = message;
        if (style)
            for (let styleIndex in style)
                text.style[styleIndex] = style[styleIndex];
        document.body.appendChild(text);
        if (showDiagnostics) {
            const error = document.createElement("p");
            error.style.marginTop = "3em";
            const text = "Diagnostics:<br/><br/>";
            for (let element in globalError)
                text += element + ": " + globalError[element] + "<br/>";
            error.innerHTML = text;
            document.head.appendChild(error);
        } // if showDiagnostics
    }; //incompatibleMessage
    
    // no "const", "let", lambda-like syntax () => {}, not "for... of Object",
    // no String.prototype.includes -- it won't work with some bad browsers    

    const saveWindowLoadHandler = window.onload;
    let hasError = false;
    window.onerror = function (message, source, line, column, error) {
        hasError = true;
        globalError.hasError = true;
        globalError.message = message;
        globalError.source = source;
        globalError.line = line;
        globalError.column = column;
        globalError.error = error;
    };
    let currentOrder = 0;
    function loadScript() {
        if (currentOrder == scripts.length)
            return;
        const scriptElement = document.createElement("script");
        scriptElement.src = scripts[currentOrder];
        scriptElement.onload = function () {
            currentOrder++;
            loadScript();
        }; //scriptElement.onload
        scriptElement.onerror = function () {
            throw new URIError("error");
        }; //scriptElement.onerror
        document.head.appendChild(scriptElement);
    }; //loadScript
    loadScript();
    window.onerror = window.onerror;
    window.onload = function () {
        if (hasError && errorAction) {
            errorAction(incompatibleMessage);
        } else if (!hasError && successAction)
            successAction();
        window.onload = saveWindowLoadHandler;
    }; //if hasError

} //handleGoodBrowser
