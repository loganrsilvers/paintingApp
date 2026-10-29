class PickStrokeWidthAction {
    constructor(strokeWidthInput, drawingState) {
        this.strokeWidthInput = strokeWidthInput;
        this.drawingState = drawingState;
        this.previousWidth = drawingState.strokeWidth;
        this.nextWidth = Number(strokeWidthInput.value);
    }

    execute() {
        this.#setWidth(this.nextWidth);
    }

    undo() {
        this.#setWidth(this.previousWidth);
    }

    redo() {
        this.#setWidth(this.nextWidth);
    }

    #setWidth(width) {
        this.drawingState.strokeWidth = width;
        this.strokeWidthInput.value = String(width);
    }
}

export default PickStrokeWidthAction;
