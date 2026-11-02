import { Graphics } from "pixi.js";
import Utils from "./Utils.js";
import SelectAction from "../actions/SelectAction.js";
import UnSelectAction from "../actions/UnSelectAction.js";
import SelectedShapeOutline from "./SelectedShapeOutline.js";

class SelectManager {
    constructor() {
        this.artworkLayer = null;
        this.selectionLayer = null;
        this.Selected = [];
        this.outlines = new Map();
        this.selectionRectangle = null;
        this.scaledShapes = new WeakSet();
    }

    initialize(artworkLayer, selectionLayer) {
        this.artworkLayer = artworkLayer;
        this.selectionLayer = selectionLayer;
    }

    selectAt(x, y) {
        let shapeAtPosition = null;
        const point = { x, y, width: 1, height: 1 };
        const shapes = this.artworkLayer.children;

        for (let index = shapes.length - 1; index >= 0; index--) {
            const shape = shapes[index];
            const bounds = shape.selectionBounds;
            if (!bounds) {
                continue;
            }

            const shapeBounds = {
                x: bounds.x + bounds.width / 2,
                y: bounds.y + bounds.height / 2,
                width: bounds.width,
                height: bounds.height
            };
            if (Utils.checkAABB(point, shapeBounds)) {
                shapeAtPosition = shape;
                break;
            }
        }

        new UnSelectAction(this).execute();
        if (shapeAtPosition) {
            new SelectAction(this, shapeAtPosition).execute();
        }
    }

    updateSelectionRectangle(start, end) {
        if (!this.selectionRectangle) {
            this.selectionRectangle = new Graphics();
            this.selectionLayer.addChild(this.selectionRectangle);
        }

        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const width = Math.max(Math.abs(end.x - start.x), 1);
        const height = Math.max(Math.abs(end.y - start.y), 1);
        this.selectionRectangle.clear()
            .rect(x, y, width, height)
            .fill({ color: 0xffffff, alpha: 0.12 })
            .stroke({ color: 0xffffff, width: 1 });
    }

    selectInBounds(start, end) {
        this.selectionRectangle?.parent?.removeChild(this.selectionRectangle);
        this.selectionRectangle = null;
        this.clearSelected();

        const bounds = {
            x: Math.min(start.x, end.x),
            y: Math.min(start.y, end.y),
            width: Math.max(Math.abs(end.x - start.x), 1),
            height: Math.max(Math.abs(end.y - start.y), 1)
        };
        const selectionBounds = {
            x: bounds.x + bounds.width / 2,
            y: bounds.y + bounds.height / 2,
            width: bounds.width,
            height: bounds.height
        };

        for (const shape of this.artworkLayer.children) {
            const shapeBounds = shape.selectionBounds;
            if (!shapeBounds) {
                continue;
            }

            if (
                Utils.checkAABB(selectionBounds, {
                    x: shapeBounds.x + shapeBounds.width / 2,
                    y: shapeBounds.y + shapeBounds.height / 2,
                    width: shapeBounds.width,
                    height: shapeBounds.height
                })
            ) {
                new SelectAction(this, shape).execute();
            }
        }
    }

    addSelected(shape) {
        if (
            !shape ||
            shape.parent !== this.artworkLayer ||
            this.Selected.includes(shape)
        ) {
            return;
        }

        this.Selected.push(shape);
        this.outlines.set(
            shape,
            new SelectedShapeOutline(shape, this.selectionLayer)
        );
    }

    removeSelected(shape) {
        const index = this.Selected.indexOf(shape);
        if (index === -1) {
            return;
        }

        this.Selected.splice(index, 1);
        this.outlines.get(shape)?.remove();
        this.outlines.delete(shape);
    }

    captureSelectedStyle(property) {
        return this.Selected
            .filter((shape) => typeof shape.applyStyle === "function")
            .map((shape) => ({
                shape,
                value: shape.styleState[property]
            }));
    }

    applySelectedStyle(property, value, shapes = this.Selected) {
        for (const shape of shapes) {
            shape.applyStyle?.(property, value);
        }
    }

    restoreSelectedStyle(property, previousStyles) {
        for (const { shape, value } of previousStyles) {
            shape.applyStyle?.(property, value);
        }
    }

    clearSelected() {
        for (const outline of this.outlines.values()) {
            outline.remove();
        }
        this.outlines.clear();
        this.Selected.length = 0;
    }

    moveSelectedBy(shapes, deltaX, deltaY) {
        for (const shape of shapes) {
            if (shape.parent !== this.artworkLayer) {
                continue;
            }

            shape.position.x += deltaX;
            shape.position.y += deltaY;
            shape.selectionBounds.x += deltaX;
            shape.selectionBounds.y += deltaY;
            this.outlines.get(shape)?.moveBy(deltaX, deltaY);
        }
    }

    captureScaleState(shapes) {
        return shapes.map((shape) => ({
            shape,
            scaleX: shape.scale.x,
            scaleY: shape.scale.y,
            pivotX: shape.pivot.x,
            pivotY: shape.pivot.y,
            positionX: shape.position.x,
            positionY: shape.position.y,
            bounds: { ...shape.selectionBounds },
            hasScaleOrigin: this.scaledShapes.has(shape)
        }));
    }

    scaleSelectedBy(shapes, deltaX, deltaY) {
        for (const shape of shapes) {
            if (shape.parent !== this.artworkLayer) {
                continue;
            }

            if (!this.scaledShapes.has(shape)) {
                const centerX =
                    shape.selectionBounds.x + shape.selectionBounds.width / 2;
                const centerY =
                    shape.selectionBounds.y + shape.selectionBounds.height / 2;
                shape.pivot.set(
                    centerX - shape.position.x,
                    centerY - shape.position.y
                );
                shape.position.set(centerX, centerY);
                this.scaledShapes.add(shape);
            }

            const previousScaleX = shape.scale.x;
            const previousScaleY = shape.scale.y;
            shape.scale.set(
                Math.max(0.01, previousScaleX + deltaX),
                Math.max(0.01, previousScaleY + deltaY)
            );

            const bounds = shape.selectionBounds;
            const centerX = bounds.x + bounds.width / 2;
            const centerY = bounds.y + bounds.height / 2;
            bounds.width *= shape.scale.x / previousScaleX;
            bounds.height *= shape.scale.y / previousScaleY;
            bounds.x = centerX - bounds.width / 2;
            bounds.y = centerY - bounds.height / 2;
            this.outlines.get(shape)?.update();
        }
    }

    restoreScaleState(states) {
        for (const state of states) {
            const {
                shape,
                scaleX,
                scaleY,
                pivotX,
                pivotY,
                positionX,
                positionY,
                bounds,
                hasScaleOrigin
            } = state;
            shape.scale.set(scaleX, scaleY);
            shape.pivot.set(pivotX, pivotY);
            shape.position.set(positionX, positionY);
            shape.selectionBounds = { ...bounds };
            if (hasScaleOrigin) {
                this.scaledShapes.add(shape);
            } else {
                this.scaledShapes.delete(shape);
            }
            this.outlines.get(shape)?.update();
        }
    }

    getSelectionCenter(shapes) {
        const bounds = shapes
            .filter((shape) => shape.parent === this.artworkLayer)
            .map((shape) => shape.selectionBounds);
        if (bounds.length === 0) {
            return null;
        }

        const left = Math.min(...bounds.map((bound) => bound.x));
        const top = Math.min(...bounds.map((bound) => bound.y));
        const right = Math.max(
            ...bounds.map((bound) => bound.x + bound.width)
        );
        const bottom = Math.max(
            ...bounds.map((bound) => bound.y + bound.height)
        );

        return { x: (left + right) / 2, y: (top + bottom) / 2 };
    }

    rotateSelectedBy(shapes, center, radians) {
        for (const shape of shapes) {
            if (shape.parent !== this.artworkLayer) {
                continue;
            }

            this.ensureCenteredTransform(shape);
            const shapeCenter = {
                x: shape.selectionBounds.x + shape.selectionBounds.width / 2,
                y: shape.selectionBounds.y + shape.selectionBounds.height / 2
            };
            const rotatedCenter = Utils.rotatePoint(shapeCenter, center, radians);
            shape.rotation += radians;
            shape.position.set(rotatedCenter.x, rotatedCenter.y);
            this.updateShapeBounds(shape);
            this.outlines.get(shape)?.update();
        }
    }

    captureRotationState(shapes) {
        return shapes.map((shape) => ({
            shape,
            rotation: shape.rotation,
            scaleX: shape.scale.x,
            scaleY: shape.scale.y,
            pivotX: shape.pivot.x,
            pivotY: shape.pivot.y,
            positionX: shape.position.x,
            positionY: shape.position.y,
            bounds: { ...shape.selectionBounds },
            hasScaleOrigin: this.scaledShapes.has(shape)
        }));
    }

    restoreRotationState(states) {
        for (const state of states) {
            const {
                shape,
                rotation,
                scaleX,
                scaleY,
                pivotX,
                pivotY,
                positionX,
                positionY,
                bounds,
                hasScaleOrigin
            } = state;
            shape.rotation = rotation;
            shape.scale.set(scaleX, scaleY);
            shape.pivot.set(pivotX, pivotY);
            shape.position.set(positionX, positionY);
            shape.selectionBounds = { ...bounds };
            if (hasScaleOrigin) {
                this.scaledShapes.add(shape);
            } else {
                this.scaledShapes.delete(shape);
            }
            this.outlines.get(shape)?.update();
        }
    }

    ensureCenteredTransform(shape) {
        if (this.scaledShapes.has(shape)) {
            return;
        }

        const centerX = shape.selectionBounds.x + shape.selectionBounds.width / 2;
        const centerY = shape.selectionBounds.y + shape.selectionBounds.height / 2;
        shape.pivot.set(centerX - shape.position.x, centerY - shape.position.y);
        shape.position.set(centerX, centerY);
        this.scaledShapes.add(shape);
    }

    updateShapeBounds(shape) {
        const bounds = shape.getBounds();
        shape.selectionBounds = {
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height
        };
    }
}

export default new SelectManager();
