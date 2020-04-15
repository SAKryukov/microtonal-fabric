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