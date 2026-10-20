import { Graphics } from "pixi.js";

class DrawStarState {

    firstX = null;
    firstY = null;
    lastX = null;
    lastY = null;
    isDrawing = false;

    constructor(stage) {
        this.stage = stage;
    }

    onPointerDown(position) {
        // TODO: Create the star and remember its starting position.
        this.firstX = position.x;
        this.firstY = position.y;
        this.isDrawing = true;
    }

    onPointerMove(position) {
        // TODO: Update the star size while the pointer is down.
        if (this.isDrawing) {
            this.lastX = position.x;
            this.lastY = position.y;
        }
    }

    onPointerUp(position) {
        if (!this.isDrawing) return;

        this.lastX = position.x;
        this.lastY = position.y;
        this.isDrawing = false;

        const centerX = (this.firstX + this.lastX) / 2;
        const centerY = (this.firstY + this.lastY) / 2;

        const radius = Math.sqrt(
            Math.pow(this.lastX - this.firstX, 2) + 
            Math.pow(this.lastY - this.firstY, 2)
        ) / 2;
        // smaller
        const innerRadius = radius * 0.45;

        
        const star = new Graphics()
            .star(centerX, centerY, 5, radius, innerRadius) 
                    // x, y, points, outerRadius, innerRadius
            .fill({ color: 0x000000, alpha: 0.5 })
            .stroke({ color: 0x000000, width: 2 });

        this.stage.addChild(star);
    }

}

export default DrawStarState;
