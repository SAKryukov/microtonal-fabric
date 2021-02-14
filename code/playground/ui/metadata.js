// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

const metadataElement = {
    initialize: function(data) {
        if (!data) return;
        const special = new Set(["title", "copyright"]);
        const createCloseBox = (size, background, border, stroke) => {
            const ns = "http://www.w3.org/2000/svg";
            const createNS = (name) => document.createElementNS(ns, name);
            const svg = createNS("svg");
            svg.style.cssText = `background-color: ${background}; stroke: ${stroke}; stroke-width: 0.1;
                border-left: ${border} thin solid; border-bottom: ${border} thin solid; width: ${size}px;
                position: absolute; top: 0; right: 0; opacity: 1`;
            svg.setAttribute("viewBox", "0 0 1 1");
            svg.innerHTML = `<g><line x1="0.2" y1="0.2" x2="0.8" y2="0.8"/><line x1="0.2" y1="0.8" x2="0.8" y2="0.2"/></g>`;
            return svg;
        };
        const remove = () => this.element.style.display = "none";
        this.element = document.createElement("aside");
        this.element.onclick = event => {
            if (event.target && event.target.constructor == HTMLAnchorElement) return;
            remove();
        } //this.element.onclick
        this.element.style.position = "absolute";
        this.element.style.display = "none";
        this.element.style.left = "1em";
        this.element.style.top = "0.6em";
        this.element.style.backgroundColor = "white";
        this.element.style.border = "solid thin black";
        this.element.style.padding = "0.4rem";
        const horizonatalPadding = "2rem";
        this.element.style.paddingLeft = horizonatalPadding;
        this.element.style.paddingRight = horizonatalPadding;
        if (data.title) {
            const p = document.createElement("h1");
            p.style.fontSize = "110%";
            p.style.margin = "0";
            p.style.marginBottom = "0.2em";
            p.textContent = data.title;
            this.element.appendChild(p);
        } //title
        for (let property in data) {
            if (special.has(property)) continue;
            const p = document.createElement("p");
            p.innerHTML = `<b>${property}</b>: ${data[property]}`;
            this.element.appendChild(p);
        } //loop
        if (data.copyright) {
            const p = document.createElement("p");
            p.innerHTML = `Copyright &copy; ${data.copyright}`;
            this.element.appendChild(p);
        } //title
        this.element.appendChild(createCloseBox(12, "yellow", "black", "red"));
        //for (let child of this.element.children)
        //    child.style.pointerEvents = "none";
        document.body.appendChild(this.element);
        window.addEventListener("keydown", function(event) {
            if (event.key == "Escape")
                remove();
        });
    },
    show: function() {
        if (this.element)
            this.element.style.display = "block";
    },
}; //metadataElement