import { Graphics } from "pixi.js";
import BackgroundTexture from "../managers/BackgroundTexture.js";

class DrawStarAction {
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

        const centerX = (this.start.x + this.end.x) / 2;
        const centerY = (this.start.y + this.end.y) / 2;
        const radiusX = Math.abs(this.end.x - this.start.x) / 2;
        const radiusY = Math.abs(this.end.y - this.start.y) / 2;
        const points = [];

        for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const radius = i % 2 === 0 ? 1 : 0.45;
            points.push(
                centerX + Math.cos(angle) * radiusX * radius,
                centerY + Math.sin(angle) * radiusY * radius
            );
        }

        const bounds = {
            x: centerX - radiusX,
            y: centerY - radiusY,
            width: radiusX * 2,
            height: radiusY * 2
        };
        const fill = new Graphics()
            .poly(points, true)
            .fill({ color: Number.parseInt(this.fillColor.slice(1), 16), alpha: 0.5 });
        const mask = new Graphics()
            .poly(points, true)
            .fill({ color: 0xffffff });
        const outline = new Graphics()
            .poly(points, true)
            .stroke({
                color: Number.parseInt(this.strokeColor.slice(1), 16),
                width: this.strokeWidth
            });

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

export default DrawStarAction;