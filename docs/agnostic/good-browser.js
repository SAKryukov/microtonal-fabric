// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

"use strict";

function handleGoodBrowser(scripts, successAction, errorAction) {

    var globalError = {
        hasError: false,
        message: null,
        source: null,
        line: null,
        column: null,
        error: null
    };
    var incompatibleMessage = function(message, style, showDiagnostics) {
        while (document.body.lastChild) document.body.removeChild(document.body.lastChild);
        document.body.style.padding = "1em";
        var text = document.createElement("p");
        text.textContent = message;
        if (style)
            for (var styleIndex in style)
                text.style[styleIndex] = style[styleIndex];
        document.body.appendChild(text);
        if (showDiagnostics) {
            var error = document.createElement("p");
            error.style.marginTop = "3em";
            var text = "Diagnostics:<br/><br/>";
            for (var element in globalError)
                text += element + ": " + globalError[element] + "<br/>";
            error.innerHTML = text;
            document.body.appendChild(error);
        } // if showDiagnostics
    }; //incompatibleMessage
    
    // no "const", "let", lambda-like syntax () => {}, not "for... of Object",
    // no String.prototype.includes -- it won't work with some bad browsers    

    var saveWindowErrorHandler = window.onerror;
    var saveBodyLoadHandler = document.body.onload;
    var hasError = false;
    var errorSource = null;
    var errorLine = null;
    var errorMessage = null;
    window.onerror = function (message, source, line, column, error) {
        hasError = true;
        globalError.hasError = true;
        globalError.message = message;
        globalError.source = source;
        globalError.line = line;
        globalError.column = column;
        globalError.error = error;
    };
    var currentOrder = 0;
    function loadScript() {
        if (currentOrder == scripts.length)
            return;
        var scriptElement = document.createElement("script");
        scriptElement.src = scripts[currentOrder];
        scriptElement.onload = function () {
            currentOrder++;
            loadScript();
        }; //scriptElement.onload
        scriptElement.onerror = function () {
            throw new URIError("error");
        }; //scriptElement.onerror
        document.body.appendChild(scriptElement);
    }; //loadScript
    loadScript();
    window.onerror = window.onerror;
    document.body.onload = function () {
        if (hasError && errorAction) {
            errorAction(incompatibleMessage);
        } else if (!hasError && successAction)
            successAction();
        document.body.onload = saveBodyLoadHandler;
    }; //if hasError

} //handleGoodBrowser
