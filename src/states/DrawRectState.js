import { Graphics } from "pixi.js";
import { constrainToSquare } from "./ShapeConstraints.js";
import BackgroundTexture from "../managers/BackgroundTexture.js";

class DrawRectState {

    firstX = null;
    firstY = null;
    lastX = null;
    lastY = null;
    isDrawing = false;

    constructor(stage) {
        this.stage = stage;
    }

    onPointerDown(position) {
        // TODO: Create the rectangle and remember its starting position.
        this.firstX = position.x;
        this.firstY = position.y;
        this.isDrawing = true;
    }

    onPointerMove(position) {
        // TODO: Update the rectangle while the pointer is down.
        if (this.isDrawing) {
            const endPosition = position.shiftKey
                ? constrainToSquare(
                    { x: this.firstX, y: this.firstY },
                    position
                )
                : position;
            this.lastX = endPosition.x;
            this.lastY = endPosition.y;
        }
    }

    onPointerUp(position) {
        // TODO: Set the final rectangle size and clear any in-progress state.
        if (!this.isDrawing) {
            return;
        }

        const endPosition = position.shiftKey
            ? constrainToSquare(
                { x: this.firstX, y: this.firstY },
                position
            )
            : position;
        this.lastX = endPosition.x;
        this.lastY = endPosition.y;
        this.isDrawing = false;

        const x = Math.min(this.firstX, this.lastX);
        const y = Math.min(this.firstY, this.lastY);
        const width = Math.abs(this.lastX - this.firstX);
        const height = Math.abs(this.lastY - this.firstY);
        const fill = new Graphics()
            .rect(x, y, width, height)
            .fill({ color: 0x000000, alpha: 0.5 });
        const mask = new Graphics()
            .rect(x, y, width, height)
            .fill({ color: 0xffffff });
        const outline = new Graphics()
            .rect(x, y, width, height)
            .stroke({ color: 0x000000, width: 2 });

        BackgroundTexture.addToShape(this.stage, {
            fill,
            mask,
            outline,
            bounds: { x, y, width, height }
        });
    }
}

export default DrawRectState;
