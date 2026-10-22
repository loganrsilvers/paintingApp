import { Graphics } from "pixi.js";
import { constrainToSquare } from "./ShapeConstraints.js";
import BackgroundTexture from "../managers/BackgroundTexture.js";

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
        if (!this.isDrawing) return;

        const endPosition = position.shiftKey
            ? constrainToSquare(
                { x: this.firstX, y: this.firstY },
                position
            )
            : position;
        this.lastX = endPosition.x;
        this.lastY = endPosition.y;
        this.isDrawing = false;

        const centerX = (this.firstX + this.lastX) / 2;
        const centerY = (this.firstY + this.lastY) / 2;
        const radiusX = Math.abs(this.lastX - this.firstX) / 2;
        const radiusY = Math.abs(this.lastY - this.firstY) / 2;
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
            .fill({ color: 0x000000, alpha: 0.5 });
        const mask = new Graphics()
            .poly(points, true)
            .fill({ color: 0xffffff });
        const outline = new Graphics()
            .poly(points, true)
            .stroke({ color: 0x000000, width: 2 });

        BackgroundTexture.addToShape(this.stage, {
            fill,
            mask,
            outline,
            bounds
        });
    }

}

export default DrawStarState;
