"use strict";

const svgPreparer = (function (svg) {
    const findNamespace = () => {
        for (let attribute of svg.attributes)
            if (attribute.localName == "xmlns:svg")
                return attribute.value;
    } //loop
    const namespace = findNamespace(svg);
    return { svg: svg, elementCreator: (tagName) => { return document.createElementNS(namespace, tagName); } };
})(elements.keyboard);

const keyboardStructure = (function() {
    const keyboardStructure = { rows: []};
    const svg = svgPreparer.svg;
    const elementCreator = svgPreparer.elementCreator;
    const rows = 11, columns = 35; //SA???
    const width = 128; //SA???
    const margins = width / 128; //SA???
    const effectiveWidth = width - 2 * margins;
    const size = effectiveWidth / columns;
    let maxY = 0;
    for (let row = 0; row < rows; ++row) {
        const currentRow = [];
        keyboardStructure.rows.push(currentRow);
        const isEven = row % 2 == 0;
        let shift = 0;
        let actualColumns = columns;
        if (isEven) {
            shift = size / 2;
            actualColumns = columns - 1;
        }
        maxY = 2 + row * size + size;
        for (let index = 0; index < actualColumns; ++index) {
            const keyRect = elementCreator("rect");
            currentRow.push(keyRect);
            keyRect.width.baseVal.value = size;
            keyRect.height.baseVal.value = size;
            keyRect.style.fill = "transparent";
            keyRect.style.stroke = "darkGray"; //SA???
            keyRect.rx.baseVal.value = 0.4;  //SA???
            keyRect.ry.baseVal.value = 0.4;
            keyRect.style.strokeWidth = width / 1400;  //SA???
            keyRect.x.baseVal.value = margins + index * size + shift;
            keyRect.y.baseVal.value = margins + row * size;
            svg.appendChild(keyRect);
        }
    }
    const viewBox = elementCreator("rect");
    svg.setAttributeNS(null, "viewBox", "0 0 " + width + " " + maxY);  //SA???
    return keyboardStructure;
})(); //keyboardStructure
