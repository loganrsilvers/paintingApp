import { Graphics } from "pixi.js";

class SelectedShapeOutline {
    constructor(shape, selectionLayer) {
        this.shape = shape;
        this.outline = new Graphics();
        this.update();
        selectionLayer.addChild(this.outline);
    }

    update() {
        const bounds = this.shape.selectionBounds;
        const padding = 3;
        const x = bounds.x - padding;
        const y = bounds.y - padding;
        const width = Math.max(bounds.width + padding * 2, 1);
        const height = Math.max(bounds.height + padding * 2, 1);

        this.outline.clear()
            .rect(x, y, width, height)
            .stroke({ color: 0xffffff, width: 2 });
    }

    remove() {
        this.outline.parent?.removeChild(this.outline);
    }

    moveBy() {
        this.update();
    }
}

export default SelectedShapeOutline;
