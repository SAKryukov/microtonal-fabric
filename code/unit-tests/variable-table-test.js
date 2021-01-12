// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

class DemoTable extends VariableTable {
    fillNewCell(row, column) {
        if (column == 0)
            return row.toString();
        return "<span>??</span>";
    } //fillNewCellHTML
    onRowAdded(row) {
        console.log("Added: ", row);
    } //onRowAdded
    onRowRemoved(row) {
        console.log("Removed: ", row);
        for (let index = this.implementation.metrics.rowFirst; index <= this.implementation.metrics.rowLast; ++index)
            this.getCell(index, 0).textContent = `${index + 1}#`;
    } //onRowRemoved
}; //class DemoTable

const table = new DemoTable(document.querySelector("table"));
const test = table.getCellValue(0, 0);
//console.log(test);