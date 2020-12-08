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
