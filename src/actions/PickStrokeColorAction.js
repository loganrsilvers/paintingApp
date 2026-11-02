class PickStrokeColorAction {
    constructor(colorPicker, colorState, selectManager = null) {
        this.colorPicker = colorPicker;
        this.colorState = colorState;
        this.selectManager = selectManager;
        this.previousShapeStyles =
            selectManager?.captureSelectedStyle("strokeColor") ?? [];
        this.previousColor = colorState.strokeColor;
        this.nextColor = colorPicker.value;
    }

    execute() {
        this.#setColor(this.nextColor);
        this.selectManager?.applySelectedStyle(
            "strokeColor",
            this.nextColor,
            this.previousShapeStyles.map(({ shape }) => shape)
        );
    }

    undo() {
        this.#setColor(this.previousColor);
        this.selectManager?.restoreSelectedStyle(
            "strokeColor",
            this.previousShapeStyles
        );
    }

    redo() {
        this.#setColor(this.nextColor);
        this.selectManager?.applySelectedStyle(
            "strokeColor",
            this.nextColor,
            this.previousShapeStyles.map(({ shape }) => shape)
        );
    }

    #setColor(color) {
        this.colorState.strokeColor = color;
        this.colorPicker.value = color;
    }
}

export default PickStrokeColorAction;
