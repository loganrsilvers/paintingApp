import { Graphics } from "pixi.js";
import { attachShapeStyle } from "../managers/ShapeStyle.js";

class DrawLineAction {
    constructor(stage, start, end, strokeColor = "#000000", strokeWidth = 2) {
        this.stage = stage;
        this.start = start;
        this.end = end;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
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
            .stroke({
                color: Number.parseInt(this.strokeColor.slice(1), 16),
                width: this.strokeWidth
            });
        const padding = this.strokeWidth / 2;
        this.shape.selectionBounds = {
            x: Math.min(this.start.x, this.end.x) - padding,
            y: Math.min(this.start.y, this.end.y) - padding,
            width: Math.abs(this.end.x - this.start.x) + padding * 2,
            height: Math.abs(this.end.y - this.start.y) + padding * 2
        };
        attachShapeStyle(this.shape, {
            strokeGraphic: this.shape,
            strokePath: (graphic) => graphic
                .moveTo(this.start.x, this.start.y)
                .lineTo(this.end.x, this.end.y),
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            onStrokeWidthChange: (previousWidth, nextWidth, shape) => {
                const delta = nextWidth - previousWidth;
                const bounds = shape.selectionBounds;
                const scaleX = Math.abs(shape.scale.x);
                const scaleY = Math.abs(shape.scale.y);
                bounds.x -= (delta * scaleX) / 2;
                bounds.y -= (delta * scaleY) / 2;
                bounds.width += delta * scaleX;
                bounds.height += delta * scaleY;
            }
        });
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