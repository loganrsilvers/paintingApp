class PickColorAction {
    constructor(colorPicker, colorState) {
        this.colorPicker = colorPicker;
        this.colorState = colorState;
        this.previousColor = colorState.fillColor;
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
        this.colorState.fillColor = color;
        this.colorPicker.value = color;
    }
}

export default PickColorAction;
