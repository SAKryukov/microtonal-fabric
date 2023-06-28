// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

const metadataElementDefinitionSet = {
    closeKey: "Escape",
    location: {
        left: "0.6em",
        top: "0.6em",
    },
    padding: {
        x: "2rem",
        y: "0.8rem",
    },
    text: {
        titleSize: "120%",
        paragraphSize: "102%",
        titleBottom: "1rem",
    },
    special: new Set(["title", "copyright"]),
    background: "Azure",
    color: "black",
    border: "solid thin",
    borderColor: "CornflowerBlue",
    closeBox: {
        size: 16,
        background: "yellow",
        cross: "red",
    } //closeBox
}; //metadataElementDefinitionSet

const metadataElement = {
    closeHandler: null,
    initialize: function(data) {
        if (!data) return;
        const createCloseBox = (size, background, border, stroke) => {
            const ns = "http://www.w3.org/2000/svg";
            const createNS = (name) => document.createElementNS(ns, name);
            const svg = createNS("svg");
            svg.style.cssText = `background-color: ${background}; stroke: ${stroke}; stroke-width: 0.1;
                border-left: ${border} thin solid; border-bottom: ${border} thin solid; width: ${size}px;
                position: absolute; top: 0; right: 0;`;
            svg.setAttribute("viewBox", "0 0 1 1");
            svg.innerHTML = `<g><line x1="0.2" y1="0.2" x2="0.8" y2="0.8"/><line x1="0.2" y1="0.8" x2="0.8" y2="0.2"/></g>`;
            return svg;
        };
        const remove = () => {
            this.element.style.display = "none";
            if (this.closeHandler)
                this.closeHandler();
        }
        this.element = document.createElement("aside");
        this.element.onclick = event => {
            if (event.target && event.target.constructor == HTMLAnchorElement) return;
            remove();
        } //this.element.onclick
        this.element.style.fontSize = metadataElementDefinitionSet.text.paragraphSize;
        this.element.style.position = "absolute";
        this.element.style.display = "none";
        this.element.style.left = metadataElementDefinitionSet.location.left;
        this.element.style.top = metadataElementDefinitionSet.location.top;
        this.element.style.backgroundColor = metadataElementDefinitionSet.background;
        this.element.style.border = metadataElementDefinitionSet.border;
        this.element.style.borderColor = metadataElementDefinitionSet.borderColor;
        this.element.style.padding = metadataElementDefinitionSet.padding.y;
        this.element.style.paddingLeft = metadataElementDefinitionSet.padding.x;
        this.element.style.paddingRight = metadataElementDefinitionSet.padding.x;
        if (data.title) {
            const p = document.createElement("h1");
            p.style.margin = "0";
            p.style.marginBottom = metadataElementDefinitionSet.text.titleBottom;
            p.innerHTML = data.title;
            this.element.appendChild(p);
        } //title
        for (let property in data) {
            if (metadataElementDefinitionSet.special.has(property)) continue;
            const p = document.createElement("p");
            p.innerHTML = `<b>${property}</b>: ${data[property]}`;
            this.element.appendChild(p);
        } //loop
        if (data.copyright) {
            const p = document.createElement("p");
            p.style.fontSize = metadataElementDefinitionSet.text.paragraphSize;
            p.innerHTML = `Copyright &copy; ${data.copyright}`;
            this.element.appendChild(p);
        } //title
        this.element.appendChild(createCloseBox(
            metadataElementDefinitionSet.closeBox.size,
            metadataElementDefinitionSet.closeBox.background,
            metadataElementDefinitionSet.borderColor,
            metadataElementDefinitionSet.closeBox.cross));
        //for (let child of this.element.children)
        //    child.style.pointerEvents = "none";
        document.body.appendChild(this.element);
        window.addEventListener("keydown", function(event) {
            if (event.key == metadataElementDefinitionSet.closeKey)
                remove();
        });
    },
    show: function(value, closeHandler) {
        if (!this.element) return;
        this.element.style.display = value ? "block" : "none";
        this.closeHandler = closeHandler;
    },
}; //metadataElement