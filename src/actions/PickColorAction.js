class PickColorAction {
    constructor(colorPicker, colorState, selectManager = null) {
        this.colorPicker = colorPicker;
        this.colorState = colorState;
        this.selectManager = selectManager;
        this.previousShapeStyles =
            selectManager?.captureSelectedStyle("fillColor") ?? [];
        this.previousColor = colorState.fillColor;
        this.nextColor = colorPicker.value;
    }

    execute() {
        this.#setColor(this.nextColor);
        this.selectManager?.applySelectedStyle(
            "fillColor",
            this.nextColor,
            this.previousShapeStyles.map(({ shape }) => shape)
        );
    }

    undo() {
        this.#setColor(this.previousColor);
        this.selectManager?.restoreSelectedStyle(
            "fillColor",
            this.previousShapeStyles
        );
    }

    redo() {
        this.#setColor(this.nextColor);
        this.selectManager?.applySelectedStyle(
            "fillColor",
            this.nextColor,
            this.previousShapeStyles.map(({ shape }) => shape)
        );
    }

    #setColor(color) {
        this.colorState.fillColor = color;
        this.colorPicker.value = color;
    }
}

export default PickColorAction;
