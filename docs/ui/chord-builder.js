function ChordBuilder(table) {

    const noteGroup = [];
    const noteInversionGroup = { inversion2: null, inversion4: null };
    const lines = [];

    const parseTableElement = function (element) {
        for (child of element.childNodes) {
            const constructor = child.constructor;
            if (constructor == HTMLInputElement) {
                const attributeType = child.getAttribute("type");
                if (attributeType == "checkbox")
                    lines.push(child);
                else if (attributeType == "radio")
                    noteGroup.push(child);
            } //if
            parseTableElement(child);
        } //loop
    } //parseTableElement
    parseTableElement(table);

    ChordBuilder.prototype.build = function () {
        return [
            { octave: 0, note: 0 },
            { octave: 1, note: 1 }
        ];
    } //build

} //ChordBuilder