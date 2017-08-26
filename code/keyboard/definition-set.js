const elements = {
    keyboard: document.getElementById("keyboard"),
    radioTet: {
        radio12et: document.getElementById("radio-12-et"),
        radio12etJanko: document.getElementById("radio-12-et-Janko"),
        radio19et: document.getElementById("radio-19-et"),
        radio31et: document.getElementById("radio-31-et"),
    },
    legend19et: document.getElementById("radio-19-et-legend"),
    legend31et: document.getElementById("radio-31-et-legend")
}; //elements


const notes = {
    tet31: {
        names: [
            "C", "D♭²", "C♯", "D♭", "C♯²",
            "D", "E♭²", "D♯", "E♭", "D♯²",
            "E", "F♭¹", "E♯¹",
            "F", "G♭²", "F♯", "G♭", "F♯²",
            "G", "A♭²", "G♯", "A♭", "G♯²",
            "A", "B♭²", "A♯", "B♭", "A♯²",
            "B", "C♭¹", "B♯¹"],
        startingMidiNote: 0,
        bigRowIncrement: 18,
        smallRowIncrement: 13,
        rightIncrement: 5
    },
    tet19: {
        names: [
            "C", "C♯", "D♭",
            "D", "D♯", "E♭",
            "E", "ef", // E♯ == F♭
            "F", "F♯", "G♭",
            "G", "G♯", "A♭",
            "A", "A♯", "B♭",
            "B", "bc"], //B♯ == C♭
        startingMidiNote: 0,
        bigRowIncrement: 11,
        smallRowIncrement: 8,
        rightIncrement: 3
    },
    tet12: {
        names: ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "B♯", "B"],
        startingMidiNote: 0,
        bigRowIncrement: 7,
        smallRowIncrement: 5,
        rightIncrement: 2
    },
    tet12Janko: {
        startingMidiNote: 24,
        bigRowIncrement: 1,
        smallRowIncrement: -1,
        rightIncrement: 2        
    }
}; //notation
notes.tet12Janko.names = notes.tet12.names; 
