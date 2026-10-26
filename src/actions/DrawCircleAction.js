import { Graphics } from "pixi.js";
import BackgroundTexture from "../managers/BackgroundTexture.js";

class DrawCircleAction {
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

        const radiusX = Math.abs(this.end.x - this.start.x) / 2;
        const radiusY = Math.abs(this.end.y - this.start.y) / 2;
        const centerX = (this.start.x + this.end.x) / 2;
        const centerY = (this.start.y + this.end.y) / 2;
        const bounds = {
            x: centerX - radiusX,
            y: centerY - radiusY,
            width: radiusX * 2,
            height: radiusY * 2
        };
        const fill = new Graphics()
            .ellipse(centerX, centerY, radiusX, radiusY)
            .fill({ color: 0x000000, alpha: 0.5 });
        const mask = new Graphics()
            .ellipse(centerX, centerY, radiusX, radiusY)
            .fill({ color: 0xffffff });
        const outline = new Graphics()
            .ellipse(centerX, centerY, radiusX, radiusY)
            .stroke({ color: 0x000000, width: 2 });

        this.shape = BackgroundTexture.addToShape(this.stage, {
            fill,
            mask,
            outline,
            bounds
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

export default DrawCircleAction;