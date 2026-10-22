import { Graphics } from "pixi.js";
import { constrainLineAngle } from "./ShapeConstraints.js";

class DrawLineState {

    firstX = null;
    firstY = null;
    lastX = null;
    lastY = null;
    isDrawing = false;

    constructor(stage) {
        this.stage = stage;
    }

    onPointerDown(position) {
        // TODO: Create the line and remember its starting position.
        this.firstX = position.x;
        this.firstY = position.y;
        this.isDrawing = true;
    }

    onPointerMove(position) {
        // TODO: Update the line endpoint while the pointer is down.
        if (this.isDrawing) {
            const endPosition = position.shiftKey
                ? constrainLineAngle(
                    { x: this.firstX, y: this.firstY },
                    position
                )
                : position;
            this.lastX = endPosition.x;
            this.lastY = endPosition.y;
        }
    }

    onPointerUp(position) {
        // TODO: Set the final line endpoint and clear any in-progress state.
        if (!this.isDrawing) {
            return;
        }

        const endPosition = position.shiftKey
            ? constrainLineAngle(
                { x: this.firstX, y: this.firstY },
                position
            )
            : position;
        this.lastX = endPosition.x;
        this.lastY = endPosition.y;
        this.isDrawing = false;

        const line = new Graphics()
            .moveTo(this.firstX, this.firstY)
            .lineTo(this.lastX, this.lastY)
            .stroke({ color: 0x000000, width: 2 });

        this.stage.addChild(line);
    }
}

export default DrawLineState;
