import { Container } from "pixi.js";
import reparentChildAtPreservingWorldTransform from "../managers/DisplayObjectReparenting.js";

class GroupShapesAction {
    constructor(selectManager, shapes) {
        this.selectManager = selectManager;
        this.artworkLayer = selectManager.artworkLayer;
        this.previousSelection = [...selectManager.Selected];
        this.shapes = shapes
            .filter((shape) => shape.parent === this.artworkLayer)
            .map((shape) => ({
                shape,
                index: this.artworkLayer.getChildIndex(shape),
            }))
            .sort((first, second) => first.index - second.index);
        this.group = null;
    }

    execute() {
        if (this.shapes.length < 2) {
            return;
        }

        if (!this.group) {
            this.group = new Container();
            this.group.label = "Group";
            this.group.isShapeGroup = true;
            this.group.shapeGroupChildOffsets = this.shapes.map(
                ({ index }) => index - this.shapes[0].index,
            );
            this.group.selectionBounds = this.#getSelectionBounds();
        }

        this.selectManager.clearSelected();
        this.artworkLayer.addChildAt(
            this.group,
            Math.min(this.shapes[0].index, this.artworkLayer.children.length),
        );
        for (const { shape } of this.shapes) {
            reparentChildAtPreservingWorldTransform(
                this.group,
                shape,
                this.group.children.length,
            );
        }
        this.selectManager.addSelected(this.group);
    }

    undo() {
        this.selectManager.clearSelected();
        const groupIndex = this.artworkLayer.getChildIndex(this.group);

        for (const { shape, index } of this.shapes) {
            const targetIndex = index === groupIndex ? groupIndex : index + 1;
            reparentChildAtPreservingWorldTransform(
                this.artworkLayer,
                shape,
                Math.min(targetIndex, this.artworkLayer.children.length),
            );
            this.selectManager.updateShapeBounds(shape);
        }

        this.artworkLayer.removeChild(this.group);
        this.#restorePreviousSelection();
    }

    redo() {
        this.execute();
    }

    #getSelectionBounds() {
        const bounds = this.shapes.map(({ shape }) => shape.selectionBounds);
        const left = Math.min(...bounds.map((bound) => bound.x));
        const top = Math.min(...bounds.map((bound) => bound.y));
        const right = Math.max(...bounds.map((bound) => bound.x + bound.width));
        const bottom = Math.max(
            ...bounds.map((bound) => bound.y + bound.height),
        );

        return {
            x: left,
            y: top,
            width: right - left,
            height: bottom - top,
        };
    }

    #restorePreviousSelection() {
        for (const shape of this.previousSelection) {
            this.selectManager.addSelected(shape);
        }
    }
}

export default GroupShapesAction;
