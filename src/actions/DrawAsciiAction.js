import { Container, Text } from "pixi.js";

class DrawAsciiAction {
    constructor(stage) {
        this.stage = stage;
        this.shape = new Container();
        this.shape.label = "ASCII Brush";
        this.shape.selectionBounds = null;
        this.stage.addChild(this.shape);
    }

    addGlyph(character, position, style, canvasBounds) {
        const glyph = new Text({
            text: character,
            style,
            resolution: window.devicePixelRatio || 1,
            roundPixels: true
        });
        glyph.anchor.set(0.5);

        const halfWidth = glyph.width / 2;
        const halfHeight = glyph.height / 2;
        const minX = Math.min(halfWidth, canvasBounds.width / 2);
        const minY = Math.min(halfHeight, canvasBounds.height / 2);
        const maxX = Math.max(minX, canvasBounds.width - halfWidth);
        const maxY = Math.max(minY, canvasBounds.height - halfHeight);
        glyph.position.set(
            Math.min(maxX, Math.max(minX, position.x)),
            Math.min(maxY, Math.max(minY, position.y))
        );
        this.shape.addChild(glyph);

        const bounds = glyph.getBounds();
        const selectionBounds = this.shape.selectionBounds;
        if (!selectionBounds) {
            this.shape.selectionBounds = {
                x: bounds.x,
                y: bounds.y,
                width: bounds.width,
                height: bounds.height
            };
            return;
        }

        const left = Math.min(selectionBounds.x, bounds.x);
        const top = Math.min(selectionBounds.y, bounds.y);
        const right = Math.max(
            selectionBounds.x + selectionBounds.width,
            bounds.x + bounds.width
        );
        const bottom = Math.max(
            selectionBounds.y + selectionBounds.height,
            bounds.y + bounds.height
        );
        this.shape.selectionBounds = {
            x: left,
            y: top,
            width: right - left,
            height: bottom - top
        };
    }

    execute() {
        if (!this.shape.parent) {
            this.stage.addChild(this.shape);
        }
    }

    undo() {
        if (this.shape.parent === this.stage) {
            this.stage.removeChild(this.shape);
        }
    }

    redo() {
        this.execute();
    }
}

export default DrawAsciiAction;
