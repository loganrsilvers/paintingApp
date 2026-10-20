import { Graphics } from "pixi.js";

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
            this.lastX = position.x;
            this.lastY = position.y;
        }
    }

    onPointerUp(position) {
        // TODO: Set the final rectangle size and clear any in-progress state.
        if (!this.isDrawing) {
            return;
        }

        this.lastX = position.x;
        this.lastY = position.y;
        this.isDrawing = false;

        const rectangle = new Graphics()
            .rect(
                Math.min(this.firstX, this.lastX),
                Math.min(this.firstY, this.lastY),
                Math.abs(this.lastX - this.firstX),
                Math.abs(this.lastY - this.firstY)
            )
            .fill({ color: 0x000000, alpha: 0.5 })
            .stroke({ color: 0x000000, width: 2 });

        this.stage.addChild(rectangle);
    }
}

export default DrawRectState;
