const key = document.querySelector("section");
const result = document.querySelector("p");
const cutTime = 100;
let time, x, y;

setMultiTouch(
    key,
    element => element == key,
    (element, touchObject, on) => {
        if (!on) { time = undefined; return; }
        result.textContent = null;
        time = performance.now();
        x = touchObject.clientX; y = touchObject.clientY;
    },
    (element, touchObject) => {
        const deltaTime = performance.now() - time;
        if (deltaTime < cutTime) {
            const deltaX = touchObject.clientX - x;
            const deltaY = touchObject.clientY - x;
            const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const speed = delta/deltaTime;
            result.textContent = speed;
        } //if
    }
);
