"use strict";

const keyboard = (definitionSet) => {

    const svgPreparer = (function (svg) {
        const findNamespace = () => {
            for (let attribute of svg.attributes)
                if (attribute.localName == "xmlns:svg")
                    return attribute.value;
        } //loop
        const namespace = findNamespace(svg);
        return { svg: svg, elementCreator: (tagName) => { return document.createElementNS(namespace, tagName); } };
    })(definitionSet.elements.keyboard);
        
    const keyboardStructure = { rows: []};

    const svg = svgPreparer.svg;

    svg.style.display = "none";
    const elementCreator = svgPreparer.elementCreator;
    const width = definitionSet.options.keyboard.width;
    const margins = width * definitionSet.options.keyboard.margins;
    const effectiveWidth = width - 2 * margins;
    const size = effectiveWidth / definitionSet.options.keyboardSize.longRowWidth;
    for (let row = 0; row < definitionSet.options.keyboardSize.rows; ++row) {
        const currentRow = [];
        keyboardStructure.rows.unshift(currentRow);
        const isEven = row % 2 == 0;
        let shift = 0;
        let actualColumns = definitionSet.options.keyboardSize.longRowWidth;
        if (isEven) {
            shift = size / 2;
            actualColumns = definitionSet.options.keyboardSize.longRowWidth - 1;
        }
        for (let index = 0; index < actualColumns; ++index) {
            const key = {};
            key.numberInRow = index;
            key.row = row;
            const keyRect = elementCreator("rect");
            key.rectangle = keyRect;
            keyRect.key = key; 
            currentRow.push(key);
            keyRect.width.baseVal.value = size;
            keyRect.height.baseVal.value = size;
            keyRect.style.fill = definitionSet.options.highlightDefault;
            keyRect.style.stroke = definitionSet.options.keyStroke;
            const radius = width * definitionSet.options.keyboard.keyRadius;
            keyRect.rx.baseVal.value = radius;
            keyRect.ry.baseVal.value = radius;
            keyRect.style.strokeWidth = width * definitionSet.options.keyboard.strokeWidth;
            keyRect.x.baseVal.value = margins + index * size + shift;
            keyRect.y.baseVal.value = margins + row * size;
            svg.appendChild(keyRect);
        } // loop columns
    } // loop rows
    const viewBox = elementCreator("rect");
    const maxY = size * definitionSet.options.keyboardSize.rows + 2 * margins;
    const blocker = elementCreator("rect");
    keyboardStructure.block = () => {
        blocker.x.baseVal.value = 0;
        blocker.y.baseVal.value = 0;
        blocker.width.baseVal.value = width;
        blocker.height.baseVal.value = maxY;
        blocker.style.fill = definitionSet.options.blockerFill;
        svg.appendChild(blocker);
        svg.style.display = null;
        definitionSet.elements.invitation.firstElementChild.onmousedown = (ev) => {
            const image = ev.target;
            const onImage = image.nextElementSibling;
            image.style.display = "none";
            onImage.style.display = "inline";
        }; //definitionSet.elements.invitation.firstElementChild.onmousedown
    }; //keyboardStructure.block
    keyboardStructure.unblock = () => {
        document.body.removeChild(definitionSet.elements.invitation);
        svg.removeChild(blocker);
    }; //keyboardStructure.unblock
    keyboardStructure.block();
    svg.setAttributeNS(null, "viewBox", "0 0 " + width + " " + maxY);  //SA???

    const notesGroup = elementCreator("g");
    svg.appendChild(notesGroup);

    keyboardStructure.iterateKeys = handler => { // handler(key)
        for (let row of keyboardStructure.rows)
            for (let cell of row)
                handler(cell);
    }; //rows.iterateKeys

    keyboardStructure.labelKeys = labelMaker => {
        while (notesGroup.firstChild)
            notesGroup.removeChild(notesGroup.firstChild);
        if (!labelMaker) return;
        for (let row of keyboardStructure.rows)
            for (let cell of row) {
                const label = elementCreator("text");
                const labelText = labelMaker(cell);
                label.innerHTML = labelText;
                const width = cell.rectangle.width.baseVal.value * definitionSet.options.label.fontSize;
                label.style = "pointer-events:none";
                label.style.fontFamily = definitionSet.options.labelFontFamily;
                label.style.fontSize = width+"px";
                label.setAttributeNS(null, "x", cell.rectangle.x.baseVal.value + width * definitionSet.options.label.paddingLeft);
                label.setAttributeNS(null, "y", cell.rectangle.y.baseVal.value + width + width * definitionSet.options.label.paddingTop);
                notesGroup.appendChild(label);
                cell.label = label;
                cell.textStack = [labelText];
            } //loop
    }; //keyboardStructure.labelKeys

    return keyboardStructure;

}; //keyboard
