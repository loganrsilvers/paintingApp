import { Graphics } from "pixi.js";
import BackgroundTexture from "../managers/BackgroundTexture.js";

class DrawRectAction {
    constructor(
        stage,
        start,
        end,
        fillColor = "#000000",
        strokeColor = "#000000",
        strokeWidth = 2
    ) {
        this.stage = stage;
        this.start = start;
        this.end = end;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
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
        const fill = new Graphics()
            .rect(x, y, width, height)
            .fill({ color: Number.parseInt(this.fillColor.slice(1), 16), alpha: 0.5 });
        const mask = new Graphics()
            .rect(x, y, width, height)
            .fill({ color: 0xffffff });
        const outline = new Graphics()
            .rect(x, y, width, height)
            .stroke({
                color: Number.parseInt(this.strokeColor.slice(1), 16),
                width: this.strokeWidth
            });

        this.shape = BackgroundTexture.addToShape(this.stage, {
            fill,
            mask,
            outline,
            bounds: { x, y, width, height }
        });
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

export default DrawRectAction;