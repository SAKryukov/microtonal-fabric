class VariableTable {

    #implementation = { metrics: { rowFirst: 0, rowLast: 0, columnFirst: 0, columnLast: 0 }, map: new Map() };

    constructor (element, derivedClassData) {
        this.#implementation.target = this;
        this.#implementation.element = element;
        this.#implementation.derivedClassData = derivedClassData;
        const implementationClosure = this.#implementation;
        this.#implementation.tableBody = element.firstElementChild;
        this.#implementation.focusPlusButton = () => setTimeout(function(){ implementationClosure.tableBody.lastElementChild.firstElementChild.firstElementChild.focus(); }, 0);
        this.#implementation.updateLastRow = () => setTimeout(function(){ implementationClosure.metrics.rowLast = implementationClosure.tableBody.childElementCount - 3;  }, 0); //SA???
        const headerRow = this.#implementation.tableBody.firstElementChild;
        (function adjustWidths() {
            const autoWidthIndices = [];
            for (let headerIndex in headerRow.children) {
                const header = headerRow.children[headerIndex];
                if (!header.innerHTML) continue;
                if (!header.innerHTML.endsWith("*")) continue;
                autoWidthIndices.push(headerIndex);
                header.innerHTML = header.innerHTML.substring(0, header.innerHTML.length - 1);
            }
            for (let index of autoWidthIndices)
                headerRow.children[index].style.width = `${100.0/autoWidthIndices.length}%`;    
        })();
        if (this.onHeadersCreated) this.onHeadersCreated(this.#implementation.tableBody.firstElementChild);
        headerRow.appendChild(document.createElement("th"));
        this.#implementation.columnCount = headerRow.childElementCount;
        this.#implementation.metrics.columnLast = this.#implementation.columnCount - 1; 
        element.style.width = "100%";
        element.style.borderCollapse = "collapse";
        element.style.border = "thick black solid";
        this.#implementation.tableBody.firstElementChild.lastElementChild.textContent =  `${String.fromCodePoint(0x2612)}`;
        this.#implementation.tableBody.firstElementChild.lastElementChild.style.color = "transparent";
        this.#implementation.addRow = (first) => {
            if (!first) {
                const newRowIndex = this.#implementation.tableBody.childElementCount - 1;
                this.#implementation.tableBody.lastElementChild.onclick = undefined;
                for (let index = 0; index < this.#implementation.columnCount - 1; ++index) {
                    const cell = this.#implementation.tableBody.lastElementChild.children[index];
                    const insertObject = this.fillNewCell(cell, newRowIndex, index);
                    while (cell.firstChild) cell.removeChild(cell.lastChild);
                    if (insertObject instanceof Element)
                        cell.appendChild(insertObject);
                    else
                        cell.innerHTML = insertObject.toString();
                } //loop
                if (this.#implementation.tableBody.childElementCount > 2) {
                    this.#implementation.tableBody.lastElementChild.lastElementChild.textContent = `${String.fromCodePoint(0x2612)}`;
                    this.#implementation.tableBody.lastElementChild.lastElementChild.onclick = event => {
                        const row = event.target.parentElement;
                        const rowIndex = Array.prototype.indexOf.call(row.parentElement.children, row);
                        row.remove();
                        implementationClosure.updateLastRow();
                        if (this.onchangeHandler) this.onchangeHandler(this);
                        setTimeout(function(){ implementationClosure.target.onRowRemoved(rowIndex - 1); }, 0);
                        implementationClosure.focusPlusButton();
                    }  //delete row
                    implementationClosure.focusPlusButton();
                } //if enough elements
                this.#implementation.updateLastRow();
                if (this.onchangeHandler) this.onchangeHandler(this);
                this.onRowAdded(newRowIndex - 1);
            } //if first
            const result = document.createElement("tr");
            for (let index = 0; index < this.#implementation.columnCount; ++index)
                result.appendChild(document.createElement("td"));
            const addButton = document.createElement("button");
            addButton.textContent = `${String.fromCodePoint(0x271A)}`;
            result.firstChild.appendChild(addButton);
            result.onclick = () => implementationClosure.addRow();
            this.#implementation.tableBody.appendChild(result);
            return result;
        }; //addRow
        this.#implementation.addRow(true);
        this.#implementation.addRow(false);
    } //constructor

    fillNewCell(row, column) { return "<span></span>"; }

    getCell(row, column) {
        const rowElement = this.#implementation.tableBody.children[row + 1];
        if (!rowElement) return rowElement;
        return rowElement.children[column];
    } //getCell

    getMapValue(cell) {
        return this.#implementation.map.get(cell);
    } //getMapValue
    setMapValue(cell, value) {
        this.#implementation.map.set(cell, value);
    } //setMapValue

    onRowRemoved(row) {}
    onRowAdded(row) {}

    set onchange(aHandler) {
        this.onchangeHandler = aHandler;
    } // handler(control, value)

    get metrics() { return this.#implementation.metrics; }

    addRow() { this.#implementation.addRow(); }

    get derivedClassData() { return this.#implementation.derivedClassData; }

    setData(dataUpdateHandler, propertyObject) {
        while (this.#implementation.tableBody.childElementCount > 3)
            this.#implementation.tableBody.removeChild(this.#implementation.tableBody.children[2]);
        this.#implementation.updateLastRow();
        if (dataUpdateHandler) setTimeout(dataUpdateHandler, 0, propertyObject);
    } //setData

} //class VariableTable
