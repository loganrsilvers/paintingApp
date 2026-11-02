class RotateShapeAction {
    constructor(selectManager, shapes, center) {
        this.selectManager = selectManager;
        this.shapes = [...shapes];
        this.center = { ...center };
        this.before = selectManager.captureRotationState(this.shapes);
        this.after = null;
        this.rotation = 0;
    }

    rotateBy(radians) {
        this.selectManager.rotateSelectedBy(
            this.shapes,
            this.center,
            radians
        );
        this.rotation += radians;
    }

    complete() {
        this.after = this.selectManager.captureRotationState(this.shapes);
    }

    execute() {
        this.selectManager.restoreRotationState(this.after);
    }

    undo() {
        this.selectManager.restoreRotationState(this.before);
    }

    redo() {
        this.execute();
    }
}

export default RotateShapeAction;
