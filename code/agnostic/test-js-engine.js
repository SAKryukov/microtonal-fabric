// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

    const goodJavaScriptEngine = (() => {
        try {
            const supportsClasses = !!Function("class a{ #b; }");
            const supportsDefaultArguments = !!Function("const f = (a = 0) => a; f();");
            return supportsClasses && supportsDefaultArguments;
        } catch {
            return false;
        }
    })();

