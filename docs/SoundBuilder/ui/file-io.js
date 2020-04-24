"use strict";

const fileIO = {

    storeFile: (fileName, content) => {
        const link = document.createElement('a');
        link.href = `${DefinitionSet.FileStorage.linkHrefMime},${content}`;
        link.download = fileName;
        link.click();
    }, //storeFile

    loadFile: (fileHandler, acceptFileTypes) => { // fileHandler(fileName)
        const input = document.createElement("input");
        input.type = "file";
        input.accept = acceptFileTypes;
        input.value = null;
        if (fileHandler)
            input.onchange = event => fileHandler(event.target.files[0]);
        input.click();
    }, //loadFile

}; //const fileIO