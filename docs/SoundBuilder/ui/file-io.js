"use strict";

const fileIO = {

    storeFile: (fileName, content) => {
        const link = document.createElement('a');
        link.href = `data:text/plain;charset=utf-8,${content}`; //sic!
        link.download = fileName;
        link.click();
    }, //storeFile

    loadTextFile: (fileHandler, acceptFileTypes) => { // fileHandler(fileName, text), acceptFileTypes: comma-separated, in the form: ".js,.json"
        const input = document.createElement("input");
        input.type = "file";
        input.accept = acceptFileTypes;
        input.value = null;
        if (fileHandler)
            input.onchange = event => {
                const fileName = event.target.files[0];
                if (!fileName) return;
                const reader = new FileReader();
                reader.readAsText(fileName);
                reader.onload = readEvent => fileHandler(fileName, readEvent.target.result);
            }; //input.onchange
        input.click();
    }, //loadTextFile

}; //const fileIO