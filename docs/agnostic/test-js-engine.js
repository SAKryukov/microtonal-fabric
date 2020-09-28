// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard

    const goodJavaScriptEngine = (() => {
        try {
            const supportsClasses = !!Function("class a{ #b; }");
            const supportsDefaultArguments = !!Function("const f = (a = 0) => a; f();");
            return supportsClasses && supportsDefaultArguments;
        } catch {
            return false;
        }
    })();

