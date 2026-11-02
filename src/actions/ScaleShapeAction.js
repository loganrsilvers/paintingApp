class ScaleShapeAction {
    constructor(selectManager, shapes) {
        this.selectManager = selectManager;
        this.shapes = [...shapes];
        this.before = selectManager.captureScaleState(this.shapes);
        this.after = null;
    }

    scaleBy(deltaX, deltaY) {
        this.selectManager.scaleSelectedBy(this.shapes, deltaX, deltaY);
    }

    complete() {
        this.after = this.selectManager.captureScaleState(this.shapes);
    }

    execute() {
        this.selectManager.restoreScaleState(this.after);
    }

    undo() {
        this.selectManager.restoreScaleState(this.before);
    }

    redo() {
        this.execute();
    }
}

export default ScaleShapeAction;
