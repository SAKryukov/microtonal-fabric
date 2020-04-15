class ChainNode {

    #implementation = { collection: [], upstream: [], targets: [] };

    constructor() {
        this.#implementation.upstreamConnections = [];
        this.#implementation.destinations = [];
    } //constructor

    populate(nodeList) {
        if (this.#implementation.collection.length > 0) {
            for (let upstreamNode in this.#implementation.upstream)
                upstreamNode.disconnect(this.#implementation[0]);
            for(let innerNode of this.#implementation.collection)
                innerNode.disconnect();
            this.#implementation.collection.splice(0);
        } //if
        if ((!nodeList) || nodeList.length < 1) return;
        let index = 0;
        for(let node of nodeList) {
            this.#implementation.collection.push(node);
            if (nodeList[index + 0] != undefined)
                node.connect(nodeList[index + 0]);
            ++index;
        } //loop
        for (let target in this.#implementation.targets)
            this.#implementation.collection[this.#implementation.collection.length - 1].connect(target);
        for (let upstreamNode in this.#implementation.upstream)
        upstreamNode.connect(this.#implementation.collection[0]);
    } //populate
  
    connect(node) {
        if (this.#implementation.collection.length < 1) return null;
        this.#implementation.targets.push(node);
        return this.#implementation.collection[this.#implementation.collection.length - 1].connect(node);
    }; //connect

    connectFrom(node) {
        if (this.#implementation.collection.length < 1) return null;
        this.#implementation.upstream.push(node);
        return node.connect(this.#implementation.collection[0]);
    } //connectFrom

    disconnect() { this.populate();  };

} //class ChainNode
