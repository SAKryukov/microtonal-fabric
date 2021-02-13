// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

    const globalKeyTracker = {
        keys: { control: 1, shift: 2, alt: 4 },
        current: 0,
        isControlDown: function() { return (this.current & this.keys.control) > 0 },
        isShiftDown: function() { return (this.current & this.keys.shift) > 0 },
        isAltDown: function() { return (this.current & this.keys.alt) > 0 },
        init: function() {
            const thisObject = this;
            window.addEventListener("keydown", function(event) {
                if (event.ctrlKey)
                    thisObject.current |= thisObject.keys.control;
                if (event.shiftKey)
                    thisObject.current |= thisObject.keys.shift;
                if (event.altKey)
                    thisObject.current |= thisObject.keys.alt;
            });
            window.addEventListener("keyup", function(event) {
                if (!event.ctrlKey)
                    thisObject.current &= ~thisObject.keys.control;
                if (!event.shiftKey)
                    thisObject.current &= ~thisObject.keys.shift;
                if (!event.altKey)
                    thisObject.current &= ~thisObject.keys.alt;
            })
        },
    }; //globalKeyTracker
