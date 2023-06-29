handleGoodBrowser([
    "../agnostic/interfaces.js",
    "../agnostic/test-js-engine.js",
    "../agnostic/enumeration.js",
    "../agnostic/mathematics.js",
    "../agnostic/initialization-controller.js",
    "../ui.components/metadata.js",
    "../ui.components/multitouch.js",
    "../ui.components/SVG.js",
    "../sound/definition-set.js",
    "../sound/chain-node.js",
    "../sound/envelope.js",
    "../sound/modulator.js",
    "../sound/modulator-set.js",
    "../sound/tone.js",
    "../sound/instrument.js",
    "../instruments/instrument-list.js",
    "ui/keyboard.js",
    "main/start.js"],
    null,
    function (incompatibleMessage) {
      incompatibleMessage(
        "Sorry, this browser does not support essential required features",
        { fontSize: "120%", textAlign: "center" },
        false);
});
