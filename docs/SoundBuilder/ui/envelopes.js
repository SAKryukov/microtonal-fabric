class EnvelopeTable extends VariableTable {

    #derivedImplementation = {};

    constructor(table, custom) {
        super(table, custom);
        this.#derivedImplementation.dampingSustainSlider =
            new Slider({ value: soundDefinitionSet.playControl.minimalSustain, min: soundDefinitionSet.playControl.minimalSustain, max: 10, step: 0.001, indicatorWidth: "4em", indicatorSuffix: " s" }, custom.dampingSustainParent);
        this.#derivedImplementation.dampingSustainSlider.onchange = (ptr, value) => { if (this.onchangeHandler) this.onchangeHandler(ptr, value); }
    } //constructor

    fillNewCell(cell, row, column) {
        const addOption = (select, text, value, isSelected) => {
            const option = document.createElement("option");
            option.textContent = text;
            option.value = value;
            option.selected = isSelected;
            select.appendChild(option);
        }; //addOption
        const minGain = this.derivedClassData.minGain;
        const maxGain = this.derivedClassData.maxGain;
        const suffix = this.derivedClassData.gainSuffix;
        switch (column) {
            case 1:
                const element = document.createElement("select");
                soundDefinitionSet.EnvelopeElementType.forEach(value => {
                    addOption(element, value.name, value.index, value.index == 0);
                })
                this.setMapValue(cell, element);
                element.onchange = (ptr, value) => { if (this.onchangeHandler) this.onchangeHandler(ptr, value); }
                return element;
            case 2:
                const gainSlider = new Slider({ min: minGain, max: maxGain, step: maxGain/1000, indicatorWidth: "4em", indicatorSuffix: suffix });
                this.setMapValue(cell, gainSlider);
                gainSlider.onchange = (ptr, value) => { if (this.onchangeHandler) this.onchangeHandler(ptr, value); }
                return gainSlider.element;
        default: // 0:
                const timeSlider = new Slider({ value: 0, min: 0, max: 120, step: 0.001, indicatorWidth: "5em", indicatorSuffix: " s"  });
                this.setMapValue(cell, timeSlider);
                timeSlider.onchange = (ptr, value) => { if (this.onchangeHandler) this.onchangeHandler(ptr, value); }
                return timeSlider.element;
        } //switch
    } //fillNewCellHTML

    onHeadersCreated(headers) {
        const buttonName = headers.dataset.buttonName;
        const addButton = (index) => {
            const button = document.createElement("button");
            button.textContent = buttonName;
            headers.children[index].appendChild(button);
            return button;
        }; //addButton
        const timeResetter = addButton(0);
        const gainResetter = addButton(2);
        const maxGain = this.derivedClassData;
        timeResetter.onclick = ev => {
            for (let index = this.metrics.rowFirst; index <= this.metrics.rowLast; ++index)
                this.getMapValue(this.getCell(index, 0)).value = soundDefinitionSet.playControl.minimalAttack;
        }; //timeResetter.onclick
        gainResetter.onclick = ev => {
            for (let index = this.metrics.rowFirst; index <= this.metrics.rowLast; ++index)
                this.getMapValue(this.getCell(index, 2)).value = maxGain;
        }; //gainResetter.onclick
    } //onHeadersCreated

    get data() {
        const result = [];
        let zero = true;
        for (let index = this.metrics.rowFirst; index <= this.metrics.rowLast; ++index) {
            const duration = this.getMapValue(this.getCell(index, 0)).value;
            const gain = this.getMapValue(this.getCell(index, 2)).value;
            if (duration > 0)
                zero = false;
            else
                continue;
            const functionElement = this.getMapValue(this.getCell(index, 1));
            const functionTypeIndex = functionElement.selectedIndex;
            const functionType = soundDefinitionSet.EnvelopeElementType.getValue(functionTypeIndex).name;
            result.push({ functionIndex: functionTypeIndex, function: functionType, duration: duration, gain: gain });
        } //loop
        const dampingSustain = this.#derivedImplementation.dampingSustainSlider.value; 
        if (zero) result.splice(0);
        return { stages: result, dampingSustain: dampingSustain };  
    } //get data

    set data(dataset) {
        if (!dataset) return;
        const goodElement = element => element != undefined && element != null;
        for (let index = 0; index < dataset.stages.length; ++index) {
            if (index > this.metrics.rowLast)
                this.addRow();
            const dataElement = dataset.stages[index];
            if (!dataElement) return;
            if (goodElement(dataElement.duration))
                this.getMapValue(this.getCell(index, 0)).value = dataElement.duration;
            if (goodElement(dataElement.gain))
                this.getMapValue(this.getCell(index, 2)).value = dataElement.gain;
            if (goodElement(dataElement.functionIndex))
                this.getMapValue(this.getCell(index, 1)).selectedIndex = dataElement.functionIndex;
        } //loop
        this.#derivedImplementation.dampingSustainSlider.value = dataset.dampingSustain;
    } //set data

}; //class DemoTable
