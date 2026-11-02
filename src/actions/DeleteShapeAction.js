class DeleteShapeAction {
    constructor(selectManager, shapes) {
        this.selectManager = selectManager;
        this.artworkLayer = selectManager.artworkLayer;
        this.shapes = shapes
            .filter((shape) => shape.parent === this.artworkLayer)
            .map((shape) => ({
                shape,
                index: this.artworkLayer.getChildIndex(shape)
            }));
    }

    execute() {
        for (const { shape } of this.shapes) {
            this.selectManager.removeSelected(shape);
            if (shape.parent === this.artworkLayer) {
                this.artworkLayer.removeChild(shape);
            }
        }
    }

    undo() {
        const shapesInLayerOrder = [...this.shapes].sort(
            (first, second) => first.index - second.index
        );

        for (const { shape, index } of shapesInLayerOrder) {
            if (shape.parent !== this.artworkLayer) {
                this.artworkLayer.addChildAt(shape, index);
            }
            this.selectManager.addSelected(shape);
        }
    }

    redo() {
        this.execute();
    }
}

export default DeleteShapeAction;
