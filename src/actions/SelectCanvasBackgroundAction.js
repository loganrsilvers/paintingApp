class SelectCanvasBackgroundAction {
    constructor(stage, backgroundLayer, backgroundPicker, backgroundState) {
        this.stage = stage;
        this.backgroundLayer = backgroundLayer;
        this.backgroundPicker = backgroundPicker;
        this.backgroundState = backgroundState;
        this.previousBackground = backgroundState.selectedBackground;
        this.nextBackground = backgroundPicker.selection;
    }

    execute() {
        this.#setBackground(this.nextBackground);
    }

    undo() {
        this.#setBackground(this.previousBackground);
    }

    redo() {
        this.#setBackground(this.nextBackground);
    }

    #setBackground(background) {
        this.backgroundState.selectedBackground = background;
        this.backgroundPicker.value = background?.id ?? "";

        if (!background) {
            if (this.backgroundLayer.parent === this.stage) {
                this.stage.removeChild(this.backgroundLayer);
            }
            return;
        }

        this.backgroundLayer.texture = background.texture;
        if (this.backgroundLayer.parent !== this.stage) {
            this.stage.addChildAt(this.backgroundLayer, 0);
        }
    }
}

export default SelectCanvasBackgroundAction;
