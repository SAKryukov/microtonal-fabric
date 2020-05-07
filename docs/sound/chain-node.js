class ChainNode {

    #implementation = { collection: [], upstream: undefined, target: undefined, isEnabled: true };

    constructor(upstream, target) {
        this.#implementation.upstream = upstream;
        this.#implementation.target = target;
        this.#implementation.connect = () => {
            if (this.#implementation.collection.length > 0) {
                this.#implementation.upstream.disconnect();
                this.#implementation.collection[this.#implementation.collection.length - 1].disconnect();
                this.#implementation.upstream.connect(this.#implementation.collection[0]);
                this.#implementation.collection[this.#implementation.collection.length - 1].connect(this.#implementation.target);
            } else
                this.#implementation.upstream.connect(this.#implementation.target);
        } //this.#implementation.connect
        this.#implementation.setEnabled = doEnable => {
            if (this.#implementation.collection.length < 1) return;
            if (!doEnable) {
                this.#implementation.upstream.disconnect();
                this.#implementation.collection[this.#implementation.collection.length - 1].disconnect();
                this.#implementation.upstream.connect(this.#implementation.target);
            } else
                this.#implementation.connect();
            this.#implementation.isEnabled = doEnable;
        }; //this.#implementation.setEnabled
        this.#implementation.deactivate = _ => {
            for (let node of this.#implementation.collection)
                node.disconnect();
        }; //this.#implementation.deactivate

    } //constructor

    populate(nodeList) {
        if (this.#implementation.isEnabled)
            this.#implementation.upstream.disconnect();
        for (let node of this.#implementation.collection)
            node.disconnect();
        this.#implementation.collection.splice(0);
        let index = 0;
        for (let node of nodeList) {
            this.#implementation.collection.push(node);
            if (nodeList[index + 1] != undefined)
                node.connect(nodeList[index + 1]);
            ++index;
        } //loop
        if (this.#implementation.isEnabled)
            this.#implementation.connect();
    } //populate

    get isEnabled() { return this.#implementation.isEnabled; }
    set isEnabled(value) { this.#implementation.setEnabled(value); }
  
    deactivate() { this.#implementation.deactivate(); }

} //class ChainNode
