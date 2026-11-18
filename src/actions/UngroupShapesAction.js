import reparentChildAtPreservingWorldTransform from "../managers/DisplayObjectReparenting.js";

class UngroupShapesAction {
    constructor(selectManager, groups) {
        this.selectManager = selectManager;
        this.artworkLayer = selectManager.artworkLayer;
        this.previousSelection = [...selectManager.Selected];
        this.groups = groups
            .filter(
                (group) =>
                    group.isShapeGroup &&
                    group.parent === this.artworkLayer &&
                    group.children.length > 0,
            )
            .map((group) => ({
                group,
                index: this.artworkLayer.getChildIndex(group),
                children: [...group.children],
                childOffsets:
                    group.shapeGroupChildOffsets ??
                    group.children.map((_, index) => index),
            }))
            .sort((first, second) => first.index - second.index);
    }

    execute() {
        this.selectManager.clearSelected();
        const selectedGroups = new Set(this.groups.map(({ group }) => group));
        const remainingSelection = this.previousSelection.filter(
            (shape) => !selectedGroups.has(shape),
        );
        const ungroupedShapes = [];

        for (const entry of [...this.groups].reverse()) {
            const groupIndex = this.artworkLayer.getChildIndex(entry.group);
            for (const [index, child] of entry.children.entries()) {
                const offset = entry.childOffsets[index];
                const targetIndex =
                    groupIndex + offset + (offset === 0 ? 0 : 1);
                reparentChildAtPreservingWorldTransform(
                    this.artworkLayer,
                    child,
                    targetIndex,
                );
                this.selectManager.updateShapeBounds(child);
                ungroupedShapes.push(child);
            }
            this.artworkLayer.removeChild(entry.group);
        }

        for (const shape of [...remainingSelection, ...ungroupedShapes]) {
            this.selectManager.addSelected(shape);
        }
    }

    undo() {
        this.selectManager.clearSelected();

        for (const { group, index, children } of this.groups) {
            this.artworkLayer.addChildAt(
                group,
                Math.min(index, this.artworkLayer.children.length),
            );
            for (const child of children) {
                reparentChildAtPreservingWorldTransform(
                    group,
                    child,
                    group.children.length,
                );
            }
        }

        for (const shape of this.previousSelection) {
            this.selectManager.addSelected(shape);
        }
    }

    redo() {
        this.execute();
    }
}

export default UngroupShapesAction;
