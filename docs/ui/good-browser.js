"use strict";

function handleGoodBrowser(scripts, successAction, errorAction) {

    // no "const", "let", lambda-like syntax () => {}, not "for... of Object",
    // no String.prototype.includes -- it won't work with some bad browsers    

    var saveWindowErrorHandler = window.onerror;
    var saveBodyLoadHandler = document.body.onload;
    var hasError = false;
    window.onerror = function (event) {
        hasError = true;
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
        if (hasError && errorAction)
            errorAction();
        else if (!hasError && successAction)
            successAction();
        document.body.onload = saveBodyLoadHandler;
    }; //if hasError

} //handleGoodBrowser

function incompatibleMessage(message, style) {
    while (document.body.lastChild) document.body.removeChild(document.body.lastChild);
    document.body.style.padding = "1em";
    var text = document.createElement("p");
    text.innerHTML = message;
    if (style)
        for (styleIndex in style)
            text.style[styleIndex] = style[styleIndex];
    document.body.appendChild(text);
} //incompatibleMessage