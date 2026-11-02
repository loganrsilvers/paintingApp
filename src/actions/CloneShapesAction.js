import ShapeCloner from "../managers/ShapeCloner.js";

class CloneShapesAction {
    constructor(selectManager, sourceShapes, offset = { x: 20, y: 20 }) {
        this.selectManager = selectManager;
        this.artworkLayer = selectManager.artworkLayer;
        this.sourceShapes = [...sourceShapes];
        this.previousSelection = [...selectManager.Selected];
        this.offset = offset;
        this.clones = null;
    }

    execute() {
        if (!this.clones) {
            this.clones = this.sourceShapes.map((shape) => {
                const clone = ShapeCloner.clone(shape);
                clone.position.x += this.offset.x;
                clone.position.y += this.offset.y;
                clone.selectionBounds.x += this.offset.x;
                clone.selectionBounds.y += this.offset.y;
                return clone;
            });
        }

        this.selectManager.clearSelected();
        for (const clone of this.clones) {
            this.artworkLayer.addChild(clone);
            this.selectManager.addSelected(clone);
        }
    }

    undo() {
        for (const clone of this.clones) {
            this.selectManager.removeSelected(clone);
            if (clone.parent === this.artworkLayer) {
                this.artworkLayer.removeChild(clone);
            }
        }

        for (const shape of this.previousSelection) {
            this.selectManager.addSelected(shape);
        }
    }

    redo() {
        this.selectManager.clearSelected();
        for (const clone of this.clones) {
            this.artworkLayer.addChild(clone);
            this.selectManager.addSelected(clone);
        }
    }
}

export default CloneShapesAction;
