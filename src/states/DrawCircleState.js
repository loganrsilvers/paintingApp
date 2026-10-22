import { Graphics } from "pixi.js";
import { constrainToSquare } from "./ShapeConstraints.js";
import BackgroundTexture from "../managers/BackgroundTexture.js";

class DrawCircleState {

    firstX = null;
    firstY = null;
    lastX = null;
    lastY = null;
    isDrawing = false;

    constructor(stage) {
        this.stage = stage;
    }

    // https://pixijs.download/dev/docs/maths.Circle.html
    onPointerDown(position) {
        // TODO: Create the circle and remember its starting position.
        this.firstX = position.x;
        this.firstY = position.y;
        this.isDrawing = true;

    }

    onPointerMove(position) {
        // TODO: Update the circle while the pointer is down.
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
        // TODO: Set the final circle size and clear any in-progress state.
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

        const radiusX = Math.abs(this.lastX - this.firstX) / 2;
        const radiusY = Math.abs(this.lastY - this.firstY) / 2;
        const centerX = (this.firstX + this.lastX) / 2;
        const centerY = (this.firstY + this.lastY) / 2;

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

        BackgroundTexture.addToShape(this.stage, {
            fill,
            mask,
            outline,
            bounds
        });
    }
}

export default DrawCircleState;
