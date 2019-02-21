const setupMultiTouchCalibration = (
    calibrationProbe,
    calibrationResult,
    buttonDone,
    calibrationDoneHandler) => {

    const eventAssigner = setMultiTouch();
    let force = 1;

    const touchHandler = (touch, isMove) => {
        calibrationResult.style.color = "red";
        const forceValue = eventAssigner.dynamicAlgorithm(touch, 1);
        if (isMove && forceValue < force) return;
        force = forceValue;
        calibrationResult.value = force.toPrecision(3);
    }; //touchHandler

    eventAssigner.assignTouchStart(calibrationProbe, (ev) => { touchHandler(ev.changedTouches[0], false); });
    eventAssigner.assignTouchMove(calibrationProbe, (ev) => { touchHandler(ev.changedTouches[0]), true; });

    buttonDone.onclick = () => {
        calibrationResult.style.color = "black";
        calibrationDoneHandler(force);
    }; //buttonDone.onclick

}; //setupMultiTouchCalibration