class MoveShapeAction {
    constructor(selectManager, shapes) {
        this.selectManager = selectManager;
        this.shapes = [...shapes];
        this.deltaX = 0;
        this.deltaY = 0;
    }

    moveBy(deltaX, deltaY) {
        this.selectManager.moveSelectedBy(this.shapes, deltaX, deltaY);
        this.deltaX += deltaX;
        this.deltaY += deltaY;
    }

    execute() {
        this.selectManager.moveSelectedBy(
            this.shapes,
            this.deltaX,
            this.deltaY
        );
    }

    undo() {
        this.selectManager.moveSelectedBy(
            this.shapes,
            -this.deltaX,
            -this.deltaY
        );
    }

    redo() {
        this.execute();
    }
}

export default MoveShapeAction;
