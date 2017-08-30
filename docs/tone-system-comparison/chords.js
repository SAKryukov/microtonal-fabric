(function setupChords() {

    let shown;
    const removeShown = function() {
        if (!shown) return;
        document.body.removeChild(shown);
        shown = null;
    }; //removeShown

    (function setupChordTables() {
        for (keyboard of elements.keyboardSet) {
            const element = keyboard.keyboard;
            const table = keyboard.chordTable.table;
            const chordBuilder = new ChordBuilder(table);
            const buildButton = keyboard.chordTable.buildButton;
            const closeButton = keyboard.chordTable.closeButton;
            closeButton.table = table;
            closeButton.onclick = function(event) {
                removeShown();
            } //closeButton.onclick
            buildButton.onclick = function(event) {
                element.resetChord();
                const chord = chordBuilder.build();
                for (let chordNote of chord)
                    element.setChordNode(chordNote.octave, chordNote.note, true);
                removeShown();
            } //buildButton.onclick
            buildButton.table = table;
            buildButton.keyboard = element;
        } //loop  
    })(); //setupChordTables

    const optimizeTableLocation = function(table) {
        const room = { x:window.innerWidth, y: window.innerHeight };
        let y = table.targetRect.top;
        if (y + table.offsetHeight > room.y)
            y = 1;
        const roomRight = room.x - table.targetRect.left - table.targetRect.width - table.offsetWidth;
        if (roomRight > 0)
            return { x: table.targetRect.left + table.targetRect.width, y: y };
        const roomLeft = table.targetRect.left - table.offsetWidth;
        if (roomLeft > 0)
            return { x: table.targetRect.left - table.offsetWidth, y: y };
        return { x: 1, y: y };
    }; //optimizeTableLocation

    window.oncontextmenu = function(event) {
        removeShown();
        let foundTable;
        for (keyboard of elements.keyboardSet) {
            const element = keyboard.keyboard;
            const table = keyboard.chordTable.table;
            const comStyle = window.getComputedStyle(element, null);
            const rect = element.getBoundingClientRect(); 
            const x = rect.left;
            const y = rect.top;
            const width = rect.width;
            const height = rect.height;
            table.targetRect = rect;
            const eventX = event.clientX;
            const eventY = event.clientY;
            if (x <= eventX && eventX <= x + width && y <= eventY && eventY <= y + height) {
                foundTable = table;
                break;
            } //if
        } //loop
        if (foundTable) {
            foundTable.style.position = "absolute";
            foundTable.style.top = 0;
            document.body.appendChild(foundTable);
            foundTable.style.marginLeft = "0px";
            foundTable.style.marginTop = "0px";
            const bestLocation = optimizeTableLocation(foundTable);
            foundTable.style.marginLeft = bestLocation.x + "px";
            foundTable.style.marginTop = bestLocation.y + "px";
            event.preventDefault();
            shown = foundTable;
        } //if
    }; //window.oncontextmenu

})();