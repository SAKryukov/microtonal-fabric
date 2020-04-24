class Filter {

    #implementation = {};

    constructor(tableElement) {
        this.#implementation.element = tableElement;
        this.#implementation.tableBody = tableElement.firstElementChild;
        this.#implementation.filters = [];
        definitionSet.FilterType.forEach(member => {
            // cells:
            const row = document.createElement("tr");
            const typeCell = document.createElement("td");
            const frequencyCell = document.createElement("td");
            const qCell = document.createElement("td");
            const gainCell = document.createElement("td");
            // type:
            const label = document.createElement("label");
            const presence = document.createElement("input");
            //radio.name = this.constructor.name;
            presence.type = "checkbox";
            presence.checked = member.index == 0;
            presence.onclick = event => { if (this.#implementation.onchange) this.#implementation.onchange(null, event.target.checked); };
            presence.value = member.name;
            label.appendChild(presence);
            label.appendChild(document.createTextNode(member.humanReadableName));
            typeCell.appendChild(label);
            // frequency:
            const frequencySlider = new Slider({ value: 350, min: 20, max: 20000, step: 1, indicatorWidth: "5.5em", indicatorSuffix: " Hz"  });
            frequencySlider.onchange = (ptr, value) => { if (this.#implementation.onchange) this.#implementation.onchange(ptr, value); }
            frequencyCell.appendChild(frequencySlider.element);
            // Q:
            let qSlider = undefined;
            if (member.index != 3 && member.index != 4) {
                qSlider = new Slider({ value: Math.log10(1), min: -4, max: 3, step: 0.01, indicatorWidth: "2.5em"  });
                qSlider.onchange = (ptr, value) => { if (this.#implementation.onchange) this.#implementation.onchange(ptr, value); }
                qCell.appendChild(qSlider.element);
            } //if Q
            // gain:
            let gainSlider = undefined;
            if (3 <= member.index && member.index <= 5) {
                gainSlider = new Slider({ value: 1, min: 0, max: 2, step: 0.1, indicatorWidth: "2em"});
                gainSlider.onchange = (ptr, value) => { if (this.#implementation.onchange) this.#implementation.onchange(ptr, value); }
                gainCell.appendChild(gainSlider.element);    
            } //if gain
            for (let cell of [typeCell, frequencyCell, qCell, gainCell]) row.appendChild(cell);
            this.#implementation.tableBody.appendChild(row);
            member.ui = { presence: presence, frequency: frequencySlider, Q: qSlider, gain: gainSlider };
        }); //definitionSet.FilterType.forEach
    } //constructor

    get data() {
        const result = [];
        definitionSet.FilterType.forEach(member => {
            const filterData = {
                present: member.ui.presence.checked,
                index: member.index,
                type: member.name,
                frequency: member.ui.frequency.value,
                Q: member.ui.Q ? Math.pow(10, member.ui.Q.value) : undefined,
                gain: member.ui.gain ? member.ui.gain.value: undefined,
            };
            result.push(filterData);
        }); //definitionSet.FilterType.forEach
        return result;
    } //get data
    set data(dataset) {
        if (!dataset) return;
        const goodElement = element => element != undefined && element != null;
        definitionSet.FilterType.forEach(member => {
            const filterData = dataset[member.index];
            if (!filterData) return;
            if (goodElement(member.ui.presence) && goodElement(filterData.present))
                member.ui.presence.checked = filterData.present;
            if (goodElement(member.ui.frequency) && goodElement(filterData.frequency))
                member.ui.frequency.value = filterData.frequency;
            if (goodElement(member.ui.Q) && goodElement(filterData.Q))
                member.ui.Q.value = Math.log10(filterData.Q);
            if (goodElement(member.ui.gain) && goodElement(filterData.gain))
                member.ui.gain.value = filterData.gain;
        }); //definitionSet.FilterType.forEach
    } //set data

    set onchange(aHandler) { this.#implementation.onchange = aHandler; } // handler(control, value)

} //class Filter