import { Container } from "pixi.js";
import ShapeCloner from "../managers/ShapeCloner.js";

class DrawRadialAction {
    constructor(drawAction) {
        this.drawAction = drawAction;
        this.stage = drawAction.stage;
        this.group = null;
    }

    execute() {
        if (this.group) {
            this.redo();
            return;
        }

        this.drawAction.execute();
        const original = this.drawAction.shape;
        if (!original) {
            return;
        }

        const count = 5 + Math.floor(Math.random() * 4);
        const bounds = original.selectionBounds;
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        const shapes = [original];
        for (let index = 1; index < count; index++) {
            shapes.push(ShapeCloner.clone(original));
        }

        for (let index = 0; index < shapes.length; index++) {
            const shape = shapes[index];
            shape.pivot.set(
                centerX - shape.position.x,
                centerY - shape.position.y
            );
            shape.position.set(centerX, centerY);
            shape.rotation = (index * Math.PI * 2) / count;
            const shapeBounds = shape.getBounds();
            shape.selectionBounds = {
                x: shapeBounds.x,
                y: shapeBounds.y,
                width: shapeBounds.width,
                height: shapeBounds.height
            };
        }

        this.group = new Container();
        this.group.label = "Radial Group";
        this.group.isShapeGroup = true;
        for (const shape of shapes) {
            this.group.addChild(shape);
        }

        const groupBounds = this.group.getBounds();
        this.group.selectionBounds = {
            x: groupBounds.x,
            y: groupBounds.y,
            width: groupBounds.width,
            height: groupBounds.height
        };
        this.stage.addChild(this.group);
    }

    undo() {
        if (this.group?.parent === this.stage) {
            this.stage.removeChild(this.group);
        }
    }

    redo() {
        if (this.group && !this.group.parent) {
            this.stage.addChild(this.group);
        }
    }
}

export default DrawRadialAction;
