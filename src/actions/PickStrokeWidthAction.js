class PickStrokeWidthAction {
    constructor(strokeWidthInput, drawingState, selectManager = null) {
        this.strokeWidthInput = strokeWidthInput;
        this.drawingState = drawingState;
        this.selectManager = selectManager;
        this.previousShapeStyles =
            selectManager?.captureSelectedStyle("strokeWidth") ?? [];
        this.previousWidth = drawingState.strokeWidth;
        this.nextWidth = Number(strokeWidthInput.value);
    }

    execute() {
        this.#setWidth(this.nextWidth);
        this.selectManager?.applySelectedStyle(
            "strokeWidth",
            this.nextWidth,
            this.previousShapeStyles.map(({ shape }) => shape)
        );
    }

    undo() {
        this.#setWidth(this.previousWidth);
        this.selectManager?.restoreSelectedStyle(
            "strokeWidth",
            this.previousShapeStyles
        );
    }

    redo() {
        this.#setWidth(this.nextWidth);
        this.selectManager?.applySelectedStyle(
            "strokeWidth",
            this.nextWidth,
            this.previousShapeStyles.map(({ shape }) => shape)
        );
    }

    #setWidth(width) {
        this.drawingState.strokeWidth = width;
        this.strokeWidthInput.value = String(width);
    }
}

export default PickStrokeWidthAction;
