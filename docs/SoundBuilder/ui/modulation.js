class ModulationTable extends VariableTable {

    #derivedImplementation = {};
    
    constructor(element, derivedClassData) {
        super(element, derivedClassData);
        if (!derivedClassData.slider) return;
        this.#derivedImplementation.masterDepth = new Slider({ value: 1, min: 0, max: 1, step: 0.001, indicatorWidth: "3em"}, derivedClassData.slider);
        this.#derivedImplementation.masterDepth.onchange = () => { if (this.onchangeHandler) this.onchangeHandler(this.#derivedImplementation, this.#derivedImplementation); }
    } //constructor

    onHeadersCreated(headers) {
        const buttonName = headers.dataset.buttonName;
        const addButton = (index) => {
            const button = document.createElement("button");
            button.textContent = buttonName;
            headers.children[index].appendChild(button);
            return button;
        }; //addButton
        const frequencyResetter = addButton(0);
        const depthResetter = addButton(1);
        frequencyResetter.onclick = ev => {
            for (let index = this.metrics.rowFirst; index <= this.metrics.rowLast; ++index)
                this.getMapValue(this.getCell(index, 0)).value = 0;
        }; //frequencyResetter.onclick
        depthResetter.onclick = ev => {
            for (let index = this.metrics.rowFirst; index <= this.metrics.rowLast; ++index)
                this.getMapValue(this.getCell(index, 1)).value = 0;
        }; //depthResetter.onclick
    } //onHeadersCreated

    fillNewCell(cell, row, column) {
        switch (column) {
                case 0: // relative frequency
                case 1: // depth
                    const suffix = (column == 0 && this.isRelative) || column == 1 ? "%" : " Hz"; 
                    const aSlider = new Slider({ value: 0, min: 0, max: 100, step: 0.01, indicatorWidth: "4em", indicatorSuffix: suffix });
                    this.setMapValue(cell, aSlider);
                    aSlider.onchange = (ptr, value) => { if (this.onchangeHandler) this.onchangeHandler(ptr, value); }
                    return aSlider.element;
                default: // 2 , use envelope
                   const input = document.createElement("input");
                   input.setAttribute("type", "checkbox");
                   input.onclick = (ptr, value) => { if (this.onchangeHandler) this.onchangeHandler(ptr, value); }
                   this.setMapValue(cell, input);
                   return input;
        }
    } //fillNewCellHTML

    get isRelative() { return this.derivedClassData.isRelative; }

    get data() {
        const result = [];
        let zero = true;
        for (let index = this.metrics.rowFirst; index <= this.metrics.rowLast; ++index) {
            const frequency = this.getMapValue(this.getCell(index, 0)).value;
            const depth = this.getMapValue(this.getCell(index, 1)).value;
            if (frequency > 0 && depth > 0)
                zero = false;
            else
                continue;
            const useEnvelope = this.getMapValue(this.getCell(index, 2)).checked;
            result.push({ frequency: frequency, depth: depth, useEnvelope: useEnvelope });
        } //loop
        if (zero) return [];
        return result;
    } //get data

    set data(dataset) {
        if (!dataset) return;
        const goodElement = element => element != undefined && element != null;
        for (let index = 0; index < dataset.length; ++index) {
            if (index > this.metrics.rowLast)
                this.addRow();
            const dataElement = dataset[index];
            if (!dataElement) return;
            if (goodElement(dataElement.frequency))
                this.getMapValue(this.getCell(index, 0)).value = dataElement.frequency;
            if (goodElement(dataElement.depth))
                this.getMapValue(this.getCell(index, 1)).value = dataElement.depth;
            if (goodElement(dataElement.useEnvelope))
                this.getMapValue(this.getCell(index, 2)).checked = dataElement.useEnvelope;
        } //loop
    } //set data

} //class ModulationTable
