const setReadonly = (target, recursive) => {
    const readonlyHandler = { set(obj, prop, value) { return false; } };
    if (recursive)
        for (let index in target) {
            const value = target[index];
            if (value == null || value == undefined) continue;
            const constructorObject = value.constructor;
            if (constructorObject == Array || constructorObject == Object)
                target[index] = setReadonly(value, recursive);
        } //loop
    return new Proxy(target, readonlyHandler);
}; //setReadonly

