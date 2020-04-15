class ConnectorNode {

    #implementation = {};
    core = null;

    constructor(core) {
        this.core = core;
        this.#implementation.upstreamConnections = [];
        this.#implementation.destinations = [];
    } //constructor

    connect(node) {
        this.#implementation.destinations.push(node);
        if (node instanceof ConnectorNode) {
            node.#implementation.upstreamConnections.push(this);
            return this.core.connect(node.core);
        } else
            return this.core.connect(node);
    }; //connect

    disconnect() { this.core.disconnect(); } // important: no special meaning to connection lists, so connect is one-way: after disconnect, include will restored underliying connections anyway 

    include() {
        for(let node of this.#implementation.upstreamConnections)
            if (node instanceof ConnectorNode)
                node.core.connect(this.core);
            else
                node.connect(this.core);
        for(let node of this.#implementation.destinations)
            if (node instanceof ConnectorNode)
                this.core.connect(node.core);
            else
                this.core.connect(node);
    } //include

    exclude() {
        for(let node of this.#implementation.upstreamConnections)
            node.disconnect(this.core);
        for(let node of this.#implementation.destinations)
            this.core.disconnect(node);
    } //exclude

} //class ConnectorNode
