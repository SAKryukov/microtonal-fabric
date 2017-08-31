(function setupChords() {

    let shown;
    const removeShown = function() {
        if (!shown) return;
        document.body.removeChild(shown);
        shown = null;
    }; //removeShown

    let enteredElement = null;

    const baseOctave = 1; // specific to circular keyboards

    (function setupChordTables() {
        for (keyboard of elements.keyboardSet) {
            const element = keyboard.keyboard;
            element.onmouseenter = function(event) {
                enteredElement = event.target;
            } //element.onmouseenter
            element.onmouseleave = function(event) {
                enteredElement = null
            } //element.onmouseleave
            const table = keyboard.chordTable.table;
            const chordBuilder = new ChordBuilder(table);
            const buildButton = keyboard.chordTable.buildButton;
            const closeButton = keyboard.chordTable.closeButton;
            closeButton.table = table;
            closeButton.onclick = function(event) {
                removeShown();
            } //closeButton.onclick
            buildButton.chordBuilder = chordBuilder;
            buildButton.keyboard = element;
            buildButton.toneCount = keyboard.toneCount; 
            buildButton.onclick = function(event) {
                const keyboard = event.target.keyboard;
                const toneCount = event.target.toneCount;
                keyboard.resetChord();
                const chord = event.target.chordBuilder.build();
                keyboard.setChordNode(baseOctave + 0, 0, true);
                for (let chordNote of chord) {
                    const noteOctave = Math.floor(chordNote.note / toneCount);
                    const note = chordNote.note % toneCount;
                    keyboard.setChordNode(baseOctave + chordNote.octave + noteOctave, note, true);
                } //loop
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
            if (event.button == 2) {
                const eventX = event.clientX;
                const eventY = event.clientY;
                if (x <= eventX && eventX <= x + width && y <= eventY && eventY <= y + height) {
                    foundTable = table;
                    break;
                } //if    
            } else if (enteredElement) {
                if (enteredElement == element) {
                    foundTable = table;
                    break;                    
                } //if
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