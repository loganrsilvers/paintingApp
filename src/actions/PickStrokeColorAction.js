class PickStrokeColorAction {
    constructor(colorPicker, colorState) {
        this.colorPicker = colorPicker;
        this.colorState = colorState;
        this.previousColor = colorState.strokeColor;
        this.nextColor = colorPicker.value;
    }

    execute() {
        this.#setColor(this.nextColor);
    }

    undo() {
        this.#setColor(this.previousColor);
    }

    redo() {
        this.#setColor(this.nextColor);
    }

    #setColor(color) {
        this.colorState.strokeColor = color;
        this.colorPicker.value = color;
    }
}

export default PickStrokeColorAction;
