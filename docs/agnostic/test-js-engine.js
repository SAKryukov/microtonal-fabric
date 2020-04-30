
    const goodJavaScriptEngine = (() => {
        try {
            eval("class a{ #b; }");
        } catch {
            return false;
        }
        return true;
    })();

