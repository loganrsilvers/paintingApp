import { Sprite } from "pixi.js";

class DrawStampAction {
    constructor(stage, start, end, stamp) {
        this.stage = stage;
        this.start = start;
        this.end = end;
        this.stamp = stamp;
        this.shape = null;
    }

    execute() {
        if (this.shape) {
            this.redo();
            return;
        }

        const x = Math.min(this.start.x, this.end.x);
        const y = Math.min(this.start.y, this.end.y);
        const width = Math.abs(this.end.x - this.start.x);
        const height = Math.abs(this.end.y - this.start.y);

        if (width < 1 || height < 1) {
            return;
        }

        const shape = new Sprite(this.stamp.texture);
        shape.position.set(x, y);
        shape.width = width;
        shape.height = height;
        shape.selectionBounds = { x, y, width, height };
        shape.label = this.stamp.name;

        this.shape = shape;
        this.stage.addChild(shape);
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

export default DrawStampAction;
