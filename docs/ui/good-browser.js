"use strict";

function handleGoodBrowser(scripts) {

    // no "const", "let", lambda-like syntax () => {}, not "for... of Object",
    // no String.prototype.includes -- it won't work with some bad browsers    

    if (navigator.appName.indexOf("Microsoft") >= 0) { // bad browser
        while (document.body.lastChild) document.body.removeChild(document.body.lastChild);
        document.body.style.padding = "1em";
        document.write("<p>Oh, " + navigator.appName + "? Nice try&hellip; <big>&#x263a;</big></p><br/><p>Sorry, such thing cannot be supported, as it does not provide minimal functionality required. Please use one of the major Web browsers.</p><br/>");
        return;
    } //if

    var currentOrder = 0;   
    function loadScript(){
        if (currentOrder == scripts.length)
            return;
        var scriptElement = document.createElement('script');
        scriptElement.src = scripts[currentOrder];
        scriptElement.onload = function() {
            currentOrder++;
            loadScript();
        }; //scriptElement.onload
        document.body.appendChild(scriptElement);
    }; //loadScript
    loadScript();       

} //handleGoodBrowser