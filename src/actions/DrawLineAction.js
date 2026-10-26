import { Graphics } from "pixi.js";

class DrawLineAction {
    constructor(stage, start, end) {
        this.stage = stage;
        this.start = start;
        this.end = end;
        this.shape = null;
    }

    execute() {
        if (this.shape) {
            this.redo();
            return;
        }

        this.shape = new Graphics()
            .moveTo(this.start.x, this.start.y)
            .lineTo(this.end.x, this.end.y)
            .stroke({ color: 0x000000, width: 2 });
        this.stage.addChild(this.shape);
    }

    undo() {
        if (this.shape?.parent === this.stage) {
            this.stage.removeChild(this.shape);
        }
    }

    redo() {
        if (this.shape && !this.shape.parent) {
            this.stage.addChild(this.shape);
        }
    }
}

export default DrawLineAction;