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
    init: function(data) {
        if (!data) return;
        const special = new Set(["title", "author", "copyright", "version", "time"]);
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
        this.element = document.createElement("aside");
        this.element.onclick = event => { event.target.style.display = "none"; }
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
            p.textContent = data.title;
            this.element.appendChild(p);
        } //title
        if (data.version) {
            const p = document.createElement("p");
            p.innerHTML = `Version: ${data.version}`;
            this.element.appendChild(p);
        } //version
        if (data.author && data.time) {
            const p = document.createElement("p");
            p.innerHTML = `Copyright &copy; ${data.author}, ${data.time}`;
            this.element.appendChild(p);
        } else {
            if (data.author) {

            } //copyright
        } //copyright
        for (let property in data) {
            if (special.has(property)) continue;
            const p = document.createElement("p");
            p.textContent = `${property}: ${data[property]}`;
            this.element.appendChild(p);
        } //loop
        this.element.appendChild(createCloseBox(12, "yellow", "black", "red"));
        for (let child of this.element.children)
            child.style.pointerEvents = "none";
        document.body.appendChild(this.element);
        const remove = () => this.element.style.display = "none";
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